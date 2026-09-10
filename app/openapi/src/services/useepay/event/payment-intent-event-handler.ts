import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import type { EventHandler } from "./event-handler";
import { UseePayWebhookEventDataStatus, UseePayWebhookEventName } from "@lib/common/consts/useepay";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";
import { MemberDeliveryFactory } from "@app/order/member";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { PixelPlatform } from "@lib/common/consts/pixel";
import { subscriptionService } from "../../payermax/subscription-service";
import { PaymentType, UseePayPaymentMethodToPaymentType } from "@lib/common/consts/payment";
import { logger } from "@lib/internal/logger";

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

            await orderDao.updateOrderById(orderInfo.id, {
                orderStatus: OrderStatus.Paid,
                paymentType: this.convertPaymentType(orderInfo.paymentType as PaymentType, event)
            });

            await MemberDeliveryFactory.create(orderInfo).deliver();
            await orderDao.updateOrderById(orderInfo.id, { orderStatus: OrderStatus.Completed });

            const subscriptionInfo = await subscriptionDao.getSubscriptionById(orderInfo.subscriptionId);
            const pixelInfo = await pixelDao.getPixelById(subscriptionInfo.pixelId);
            if (pixelInfo && pixelInfo.platfrom === PixelPlatform.Facebook) {
                await subscriptionService.sendFacebookEvent(pixelInfo, subscriptionInfo);
            }

            if (pixelInfo && pixelInfo.platfrom === PixelPlatform.TikTok) {
                await subscriptionService.sendTikTokEvent(pixelInfo, subscriptionInfo);
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
