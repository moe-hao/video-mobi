import { OrderStatus } from "@lib/common/consts/order";
import { PaymentChannel } from "@lib/common/consts/payment";
import type { Payment, PaymentInfo, PaymentOrder } from "./payment";
import { CheckoutPaymentIntent, Client, Environment, LogLevel, OrdersController, SubscriptionsController } from "@paypal/paypal-server-sdk";
import config from "@lib/internal/config";
import { SkuType } from "@lib/common/consts/sku";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { orderDao } from "@lib/repo/dao/order.dao";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { uuid } from "@lib/common/utils/uuid";

export class PaypalPayment implements Payment {
    private paymentChannel: PaymentChannel = PaymentChannel.Paypal;
    private client: Client;

    constructor() {
        this.client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: config.PaypalClientId,
                oAuthClientSecret: config.PaypalSecret,
            },
            environment: config.AppEnv === 'prod' ? Environment.Production : Environment.Sandbox,
            logging: {
                logLevel: LogLevel.Info,
            }
        });
    }

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        if (paymentInfo.skuInfo.skuType === SkuType.Subscription) {
            return this.createSubscriptionOrder(paymentInfo);
        }
        return this.createNormalOrder(paymentInfo);
    }

    private async createSubscriptionOrder(paymentInfo: PaymentInfo) {
        const subscriptionsController = new SubscriptionsController(this.client);
        console.log(`${paymentInfo.productInfo.host}${paymentInfo.reback}`);
        const resp = await subscriptionsController.createSubscription({
            body: {
                planId: paymentInfo.skuInfo.paypalPlanId,
                customId: paymentInfo.userInfo.bizId,
                applicationContext: {
                    locale: paymentInfo.productInfo.language,
                    returnUrl: `https://${paymentInfo.productInfo.host}${paymentInfo.reback}`,
                    cancelUrl: `https://${paymentInfo.productInfo.host}${paymentInfo.reback}`,
                }
            }
        });


        const redirectUrl = resp.result.links?.find((link) => link.rel === 'approve')?.href || '';

        await subscriptionDao.addSubscription({
            bizId: uuid(),
            userId: paymentInfo.userInfo.id,
            subscriptionNo: resp.result.id || '',
            subscriptionStatus: SubscriptionStatus.InActive,
            subscriptionChannel: this.paymentChannel,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            ad: paymentInfo.ad || "",
        });

        return {
            orderId: 0,
            orderBizId: '',
            subscriptionNo: resp.result.id as string,
            paymentId: '',
            redirectUrl: redirectUrl,
        };
    }

    private async createNormalOrder(paymentInfo: PaymentInfo) {
        const ordersController = new OrdersController(this.client);
        const resp = await ordersController.createOrder({
            body: {
                intent: CheckoutPaymentIntent.Capture,
                purchaseUnits: [{
                    amount: {
                        currencyCode: paymentInfo.skuInfo.currency,
                        value: paymentInfo.skuInfo.price,
                    }
                }],
                applicationContext: {
                    locale: paymentInfo.productInfo.language,
                    returnUrl: `https://${paymentInfo.productInfo.host}${paymentInfo.reback}`,
                    cancelUrl: `https://${paymentInfo.productInfo.host}${paymentInfo.reback}`,
                }
            }
        });

        const orderBizId = await orderBizIdGenerator.generate();
        const orderInfo = {
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            paymentId: resp.result.id || '',
            paymentChannel: this.paymentChannel,
            paymentType: paymentInfo.paymentType,
            orderStatus: OrderStatus.Pending,
            orderType: paymentInfo.skuInfo.skuType,
            pixelId: paymentInfo.pixelId,
            ad: paymentInfo.ad || "",
        }
        const orderId = await orderDao.addOrder(orderInfo);

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: '',
            paymentId: resp.result.id || '',
            redirectUrl: resp.result.links?.find((link) => link.rel === 'approve')?.href || '',
        };
    }
}
