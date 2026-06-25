
import { readFileSync } from "fs";
import crypto from "crypto";
import { PaymentType, type PaymentChannel } from "@lib/common/consts/payment";
import type {
    PayermaxOrderAndPayData,
    PayermaxOrderAndPayResult,
    PayermaxRequestBody,
    PayermaxResponse,
    PayermaxSubscriptionCancelData,
    PayermaxSubscriptionCreateData,
    PayermaxSubscriptionCreatePeriodAmount,
    PayermaxSubscriptionCreatePeriodRule,
    PayermaxSubscriptionCreatePlan,
    PayermaxSubscriptionCreateResult
} from "./payermax.interface";
import config from "@lib/internal/config";
import { logger } from "@lib/internal/logger";
import { PayermaxResponseCode } from "@lib/common/consts/payermax";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import type { ProductSelect } from "@lib/repo/models/product";
import type { SkuSelect } from "@lib/repo/models/sku";


const path = {
    OrderAndPay: '/orderAndPay',
    OrderQuery: '/orderQuery',
    SubscriptionCreate: '/subscriptionCreate',
    SubscriptionQuery: '/subscriptionQuery',
    SubscriptionCancel: '/subscriptionCancel',
}

interface PaymentInfo {
    userBizId: string;
    orderBizId: string;
    amount: string;
    paymentChannel: PaymentChannel;
    paymentType: PaymentType;
    subscriptionNo?: string;
    reback: string;
}

function generatePayermaxRequestBody<T>(data: T): PayermaxRequestBody<T> {
    return {
        version: '1.5',
        keyVersion: '1',
        requestTime: new Date().toISOString(),
        appId: config.PayermaxAppId,
        merchantNo: config.PayermaxMerchantNo,
        data: data,
    }
}

function generatePayermaxSign(body: string): string {
    const privateKey = readFileSync(config.PayermaxPrivateKey);
    return crypto.createSign('RSA-SHA256').update(body).end().sign(privateKey, 'base64');
}

class PayermaxProxy {
    private readonly host = config.PayermaxHost;

    private async request<T>(path: string, data: PayermaxRequestBody<T>): Promise<Response> {
        const url = `${this.host}${path}`;
        const body = JSON.stringify(data);
        const sign = generatePayermaxSign(body);

        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sign': sign,
            },
            body: body,
        });
    }

    async payOrder(productInfo: ProductSelect, paymentInfo: PaymentInfo): Promise<PayermaxOrderAndPayResult> {
        const data: PayermaxOrderAndPayData = {
            outTradeNo: paymentInfo.orderBizId,
            integrate: 'Hosted_Checkout',
            subject: 'Video Mobi Subscription',
            totalAmount: paymentInfo.amount,
            currency: productInfo.currency,
            country: productInfo.region,
            userId: paymentInfo.userBizId,
            language: productInfo.language,
            frontCallbackUrl: `http://${productInfo.host}${paymentInfo.reback}`,
            notifyUrl: config.PayermaxPaymentNotifyUrl,
            mitManagementUrl: `http://${productInfo.host}`,
        }

        if (paymentInfo.subscriptionNo && paymentInfo.paymentType !== PaymentType.Pix) {
            data.subscriptionPlan = {
                subscriptionNo: paymentInfo.subscriptionNo,
            }
            data.paymentDetail = {
                paymentMethodType: paymentInfo.paymentType,
                mitType: 'SCHEDULED',
                tokenForFutureUse: true,
                merchantInitiated: false,
            }
        }

        logger.info(`PayOrder request data: ${JSON.stringify(data)}`);
        const body = generatePayermaxRequestBody(data);
        const resp = await this.request(path.OrderAndPay, body);
        const result = await resp.json() as PayermaxResponse<PayermaxOrderAndPayResult>;
        logger.info(`PayOrder result: ${result.data}`);
        return result.data;
    }

    async createSubscription(userBizId: string, subscriptionBizId: string, productInfo: ProductSelect, skuInfo: SkuSelect): Promise<PayermaxSubscriptionCreateResult> {
        const periodRule: PayermaxSubscriptionCreatePeriodRule = {
            periodUnit: skuInfo.periodType,
            periodCount: 1,
        }

        const periodAmount: PayermaxSubscriptionCreatePeriodAmount = {
            amount: skuInfo.price,
            currency: productInfo.currency,
        }

        const subscriptionPlan: PayermaxSubscriptionCreatePlan = {
            subject: 'Video Mobi Subscription',
            totalPeriods: skuInfo.periodTotal,
            periodRule: periodRule,
            periodAmount: periodAmount,
        }

        const data: PayermaxSubscriptionCreateData = {
            subscriptionRequestId: subscriptionBizId,
            userId: userBizId,
            callbackUrl: config.PayermaxSubscriptionNotifyUrl,
            subscriptionPlan: subscriptionPlan,
        }

        const body = generatePayermaxRequestBody(data);

        const resp = await this.request(path.SubscriptionCreate, body);
        const result = await resp.json();
        logger.info(`CreateSubscription result: ${result.data}`);
        return {
            subscriptionRequestId: result.data?.subscriptionRequestId || '',
            subscriptionNo: result.data?.subscriptionPlan.subscriptionNo || '',
            subscriptionStatus: result.data?.subscriptionPlan.subscriptionStatus || '',
        }
    }

    async cancelSubscription(subscriptionNo: string): Promise<void> {
        const subscriptionCancelData: PayermaxSubscriptionCancelData = { subscriptionNo: subscriptionNo };
        const body = generatePayermaxRequestBody(subscriptionCancelData);
        const resp = await this.request(path.SubscriptionCancel, body);
        const result = await resp.json();
        logger.info(`CancelSubscription result: ${result.data}`);

        if (result.data.code && result.data.code !== PayermaxResponseCode.ApplySuccess) {
            throw new InternalException(ResultCode.PayermaxFailed);
        }
    }
}

export const payermaxProxy = new PayermaxProxy();
