import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import type { EventHandler } from "./event-handler";
import { UseePayWebhookEventDataStatus, UseePayWebhookEventName } from "@lib/common/consts/useepay";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";
import { MemberDeliveryFactory } from "@app/order/member";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { PixelPlatform } from "@lib/common/consts/pixel";
import { subscriptionService } from "../../payermax/subscription-service";
import { PaymentType, UseePayPaymentMethodToPaymentType } from "@lib/common/consts/payment";
import { logger } from "@lib/internal/base/logger";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";

export class PaymentIntentEventHandler implements EventHandler {
    async handle(event: UseePayWebhookEvent): Promise<void> {
        if (event.name === UseePayWebhookEventName.PaymentIntentSucceeded && event.data.status === UseePayWebhookEventDataStatus.PaymentIntentSucceeded) {
            await this.handlePaymentIntentSucceeded(event);
        }

        if (event.name === UseePayWebhookEventName.PaymentIntentFailed && event.data.status === UseePayWebhookEventDataStatus.PaymentIntentFailed) {
            await this.handlePaymentIntentFailed(event);
        }
    }

    private async handlePaymentIntentSucceeded(event: UseePayWebhookEvent) {
        if (event.data.merchant_order_id) {
            const orderInfo = await orderDao.getOrderByBizId(event.data.merchant_order_id);
            if (orderInfo) {
                await orderDao.updateOrderById(orderInfo.id, {
                    orderStatus: OrderStatus.Paid,
                    paymentType: this.convertPaymentType(orderInfo.paymentType as PaymentType, event)
                });

                await MemberDeliveryFactory.create(orderInfo).deliver();
                await orderDao.updateOrderById(orderInfo.id, { orderStatus: OrderStatus.Completed });

                const pixelInfo = await pixelDao.getPixelById(orderInfo.pixelId);
                if (pixelInfo) {
                    if (pixelInfo.platfrom === PixelPlatform.Facebook) {
                        await subscriptionService.sendFacebookEventCoin(pixelInfo, orderInfo);
                    }

                    if (pixelInfo.platfrom === PixelPlatform.TikTok) {
                        await subscriptionService.sendTikTokEventCoin(pixelInfo, orderInfo);
                    }
                }
            }

            // 没有查到订单 但是有订阅id 说明是续订 需要新建续订订单
            if (!orderInfo && event.data.subscriptionId) {
                const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(event.data.subscriptionId);
                if (subscriptionInfo) {
                    const orderInfoList = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);
                    const [latestOrderInfo] = orderInfoList;
                    const orderBizId = await orderBizIdGenerator.generate();

                    const orderId = await orderDao.addOrder({
                        bizId: orderBizId,
                        userId: subscriptionInfo.userId,
                        amount: event.data.amount?.toString(),
                        currency: event.data.currency,
                        skuId: subscriptionInfo.skuId,
                        productId: subscriptionInfo.productId,
                        paymentId: event.data.order_id,
                        subscriptionId: subscriptionInfo.id,
                        paymentChannel: subscriptionInfo.subscriptionChannel,
                        paymentType: latestOrderInfo.paymentType,
                        orderType: latestOrderInfo.orderType,
                        orderStatus: OrderStatus.Paid,
                        subscriptionCount: orderInfoList.length + 1,
                        ad: "",
                    });

                    const newOrderInfo = await orderDao.getOrderById(orderId);
                    await MemberDeliveryFactory.create(newOrderInfo).deliver();
                    await orderDao.updateOrderById(orderId, { orderStatus: OrderStatus.Completed });
                }

            }
        }
    }

    private async handlePaymentIntentFailed(event: UseePayWebhookEvent) {
        if (event.data.merchant_order_id) {
            const orderInfo = await orderDao.getOrderByBizId(event.data.merchant_order_id);
            await orderDao.updateOrderById(orderInfo.id, {
                orderStatus: OrderStatus.Failed,
                paymentType: this.convertPaymentType(orderInfo.paymentType as PaymentType, event)
            });
        }
    }

    private convertPaymentType(origin: PaymentType, event: UseePayWebhookEvent): PaymentType {
        logger.info(`convertPaymentType: ${origin}, ${event.data.paymentAttempt?.payment_method_details?.type}`);
        if (event.data.paymentAttempt) {
            return UseePayPaymentMethodToPaymentType[event.data.paymentAttempt.payment_method_details.type];
        }
        return origin;
    }
}
