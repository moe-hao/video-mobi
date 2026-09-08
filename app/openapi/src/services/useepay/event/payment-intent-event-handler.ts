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

export class PaymentIntentEventHandler implements EventHandler {
    async handle(event: UseePayWebhookEvent): Promise<void> {
        if (event.name === UseePayWebhookEventName.PaymentIntentSucceeded && event.data.status === UseePayWebhookEventDataStatus.PaymentIntentSucceeded) {
            await this.handlePaymentIntentSucceeded(event);
        }
    }

    async handlePaymentIntentSucceeded(event: UseePayWebhookEvent) {
        if (event.data.merchant_order_id) {
            const orderInfo = await orderDao.getOrderByBizId(event.data.merchant_order_id);
            await orderDao.updateOrderById(orderInfo.id, { orderStatus: OrderStatus.Paid });
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
}
