import { OrderStatus } from "@lib/common/consts/order";
import { PaymentChannel } from "@lib/common/consts/payment";
import type { Payment, PaymentApproveInfo, PaymentInfo, PaymentOrder } from "./payment";
import { CheckoutPaymentIntent, Client, OrdersController, SubscriptionsController } from "@paypal/paypal-server-sdk";
import config from "@lib/internal/config";
import { SkuType } from "@lib/common/consts/sku";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { orderDao } from "@lib/repo/dao/order.dao";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { logger } from "@lib/internal/logger";
import { ResultCode } from "@lib/common/consts/result";
import { PaypalOrderStatus } from "@lib/common/consts/paypal";
import { memberDelivery } from "@app/order/member/member-delivery";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";

export class PaypalPayment implements Payment {
    private paymentChannel: PaymentChannel = PaymentChannel.Paypal;
    private client: Client;

    constructor() {
        this.client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: config.PaypalClientId,
                oAuthClientSecret: config.PaypalSecret,
            }
        })
    }

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        if (paymentInfo.skuInfo.skuType === SkuType.Subscription) {
            return this.createSubscriptionOrder(paymentInfo);
        }
        return this.createNormalOrder(paymentInfo);
    }

    private async createSubscriptionOrder(paymentInfo: PaymentInfo) {
        const subscriptionsController = new SubscriptionsController(this.client);
        const resp = await subscriptionsController.createSubscription({
            body: {
                planId: paymentInfo.skuInfo.paypalPlanId,
                customId: paymentInfo.userInfo.bizId,
            }
        });

        await subscriptionDao.addSubscription({
            userId: paymentInfo.userInfo.id,
            subscriptionNo: resp.result.id || '',
            subscriptionStatus: SubscriptionStatus.InActive,
            subscriptionChannel: this.paymentChannel,
            skuId: paymentInfo.skuInfo.id,
        });

        return {
            orderId: 0,
            orderBizId: '',
            subscriptionNo: resp.result.id as string,
            paymentId: '',
            redirectUrl: '',
        };
    }

    private async createNormalOrder(paymentInfo: PaymentInfo) {
        const ordersController = new OrdersController(this.client);
        const resp = await ordersController.createOrder({
            body: {
                intent: CheckoutPaymentIntent.Capture,
                purchaseUnits: [{
                    amount: {
                        currencyCode: paymentInfo.productInfo.currency,
                        value: paymentInfo.skuInfo.price,
                    }
                }]
            }
        });

        const orderBizId = await orderBizIdGenerator.generate();
        const orderInfo = {
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.price,
            skuId: paymentInfo.skuInfo.id,
            paymentId: resp.result.id || '',
            paymentChannel: this.paymentChannel,
            orderStatus: OrderStatus.Pending,
        }
        const orderId = await orderDao.addOrder(orderInfo);

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: '',
            paymentId: resp.result.id || '',
            redirectUrl: '',
        };
    }

    async approveOrder(approveInfo: PaymentApproveInfo): Promise<void> {
        if (approveInfo.subscriptionNo) {
            await subscriptionDao.updateSubscriptionByNo(approveInfo.subscriptionNo, {
                subscriptionStatus: SubscriptionStatus.Active,
                subscriptionChannel: this.paymentChannel,
            });
            return;
        }

        const orderInfo = await orderDao.getOrderByPaymentIdAndChannel(approveInfo.paymentId, this.paymentChannel);
        if (!orderInfo) {
            logger.error(`Order Not Found - paymentId: ${approveInfo.paymentId}`);
            throw new InternalException(ResultCode.ResourceNotFound.code, `Order Not Found - paymentId: ${approveInfo.paymentId}`);
        }

        logger.info(`Approve Order Info ${JSON.stringify(orderInfo)}`);
        const ordersController = new OrdersController(this.client);
        const resp = await ordersController.captureOrder({ id: approveInfo.paymentId });
        const paypalOrderStatus = resp.result.status as string;

        if (paypalOrderStatus && paypalOrderStatus === PaypalOrderStatus.Completed) {
            await orderDao.updateOrderById(orderInfo.id, {
                orderStatus: OrderStatus.Paid,
                paymentType: approveInfo.paymentType,
            });

            await this.completeOrder(approveInfo.paymentId);
        }
    }

    async closeOrder(paymentId: string): Promise<void> {
        await orderDao.updateOrderByPaymentId(paymentId, {
            orderStatus: OrderStatus.Closed,
        });
    }

    async completeOrder(paymentId: string): Promise<void> {
        const orderInfo = await orderDao.getOrderByPaymentIdAndChannel(paymentId, this.paymentChannel);

        await memberDelivery.deliver(orderInfo);
        await orderDao.updateOrderByPaymentId(paymentId, {
            orderStatus: OrderStatus.Completed,
        });
    }

    async failedOrder(paymentId: string): Promise<void> {
        await orderDao.updateOrderByPaymentId(paymentId, {
            orderStatus: OrderStatus.Failed,
        });
    }
}
