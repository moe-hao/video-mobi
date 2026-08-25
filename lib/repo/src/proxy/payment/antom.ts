import crypto from "crypto";
import config from "@lib/internal/config";
import { readFileSync } from "fs";
import type { CancelSubscriptionResp, CreateSubscriptionResp, GetExchangeRateResp } from "./antom.interface";
import { logger } from "@lib/internal/logger";
import type { SkuSelect } from "@lib/repo/models/sku";
import { SkuPeriodType, SkuPeriodTypeToAntomPeriodType, SkuType } from "@lib/common/consts/sku";
import type { OrderSelect } from "@lib/repo/models/order";
import type { ProductSelect } from "@lib/repo/models/product";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import http from "@lib/internal/http";

export const antomValueRatio: Map<string, number> = new Map([
    ['CLP', 1],
    ['JPY', 1],
    ['KRW', 1],
    ['VND', 1],
]);

function antomAmount(currency: string, amount: string): number {
    const ratio = antomValueRatio.get(currency) || 100;
    return Math.round(Number(amount) * ratio);
}

function formatISO8601(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const utc8 = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return `${utc8.getUTCFullYear()}-${pad(utc8.getUTCMonth() + 1)}-${pad(utc8.getUTCDate())}T${pad(utc8.getUTCHours())}:${pad(utc8.getUTCMinutes())}:${pad(utc8.getUTCSeconds())}+08:00`;
}

class AntomProxy {
    constructor(
        private readonly baseURL: string = 'https://open-sea.alipay.com/ams',
        private readonly clientId: string = config.AntomClientId,
    ) { }

    private signature(path: string, time: string, body: string) {
        const privateKey = readFileSync(config.AntomPrivateKey);
        const content = `POST /ams${path}\n${this.clientId}.${time}.${body}`;
        const sign = crypto.createSign('RSA-SHA256').update(content).end().sign(privateKey, 'base64');
        return encodeURIComponent(sign);
    }

    private async request<ResponseType>(path: string, body: string): Promise<ResponseType> {
        if (config.AppEnv !== 'prod') {
            path = `/sandbox${path}`
        }

        logger.info(`request antom ${path}: ${body}`);
        const requestTime = Date.now().toString();
        const signature = this.signature(path, requestTime, body);

        const resp = await http.post<ResponseType>(`${this.baseURL}${path}`, body, {
            headers: {
                'signature': `algorithm=RSA256, keyVersion=1, signature=${signature}`,
                'client-id': this.clientId,
                'request-time': requestTime,
                'content-type': 'application/json; charset=UTF-8',
            }
        });

        logger.info(`response antom ${path}: ${JSON.stringify(resp.data)}`);
        return resp.data;
    }

    async createPaymentSession(productInfo: ProductSelect, skuInfo: SkuSelect, paymentType: string, orderInfo: OrderSelect, reback: string): Promise<string> {
        let settlementCurrency = 'USD';
        if (config.AppEnv !== 'prod') {
            settlementCurrency = 'HKD';
        }

        const paymentSessionInfo = {
            order: {
                orderAmount: { currency: skuInfo.currency, value: antomAmount(skuInfo.currency, skuInfo.price).toString() },
                referenceOrderId: orderInfo.bizId,
                orderDescription: "Blue Arc Payment",
                buyer: { referenceBuyerId: orderInfo.userId.toString() },
            },
            paymentRequestId: orderInfo.bizId,
            paymentAmount: { currency: skuInfo.currency, value: antomAmount(skuInfo.currency, skuInfo.price).toString() },
            settlementStrategy: { settlementCurrency: settlementCurrency },
            productCode: 'CASHIER_PAYMENT',
            paymentRedirectUrl: `https://${productInfo.host}${reback}`,
            paymentNotifyUrl: config.AntomNotifyUrl,
            productScene: 'CHECKOUT_PAYMENT',
            paymentMethod: {
                paymentMethodType: paymentType,
                paymentMethodMetaData: {
                    is3DSAuthenticated: false,
                }
            },
            paymentFactor: {
                isAuthorization: false,
            }
        };

        if (skuInfo.skuType === SkuType.Subscription) {
            const trials = [];
            if (skuInfo.firstPeriodPrice !== '0.00') {
                trials.push({
                    trialStartPeriod: "1",
                    trialAmount: { currency: skuInfo.currency, value: antomAmount(skuInfo.currency, skuInfo.firstPeriodPrice).toString() }
                })
            }

            paymentSessionInfo.paymentMethod.paymentMethodMetaData.is3DSAuthenticated = true;
            paymentSessionInfo.paymentFactor.isAuthorization = true;
            const subscriptionPaymentSessionInfo = {
                ...paymentSessionInfo,
                subscriptionInfo: {
                    subscriptionDescription: "Blue Arc Subscription",
                    subscriptionStartTime: formatISO8601(new Date()),
                    subscriptionNotifyUrl: config.AntomNotifyUrl,
                    periodRule: {
                        periodType: SkuPeriodTypeToAntomPeriodType[skuInfo.periodType as SkuPeriodType],
                        periodCount: "1",
                    },
                    trials: trials,
                }
            };
            const result = await this.request<CreateSubscriptionResp>('/api/v1/payments/createPaymentSession', JSON.stringify(subscriptionPaymentSessionInfo));
            return result.normalUrl;
        } else {
            const result = await this.request<CreateSubscriptionResp>('/api/v1/payments/createPaymentSession', JSON.stringify(paymentSessionInfo));
            return result.normalUrl;
        }
    }

    async cancelSubscription(subscriptionNo: string): Promise<void> {
        const cancelData = {
            subscriptionId: subscriptionNo,
            cancellationType: 'CANCEL',
        }

        const result = await this.request<CancelSubscriptionResp>('/api/v1/subscriptions/cancel', JSON.stringify(cancelData));
        if (result.result.resultStatus !== 'S') {
            throw new InternalException(ResultCode.OperationFailed.code, result.result.resultMessage);
        }
    }

    async getExchangeRate(base: string, target: string): Promise<number> {
        const data = {
            buyCurrency: target,
            sellCurrency: base,
            rateType: 'REFERENCE_TRADE',
            productCode: 'CASHIER_PAYMENT'
        }
        const result = await this.request<GetExchangeRateResp>('/v1/payments/inquireExchangeRate', JSON.stringify(data));
        const [rateInfo] = result.paymentQuotes;
        return rateInfo.exchangeRate;
    }
}

export const antomProxy = new AntomProxy();
