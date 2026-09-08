import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import type { EventHandler } from "./event-handler";
import { UseePayWebhookEventDataStatus, UseePayWebhookEventName } from "@lib/common/consts/useepay";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
// import { orderDao } from "@lib/repo/dao/order.dao";

export class SubscriptionEventHandler implements EventHandler {
    async handle(event: UseePayWebhookEvent): Promise<void> {
        if (event.name === UseePayWebhookEventName.SubscriptionActive && event.data.status === UseePayWebhookEventDataStatus.SubscriptionActive) {
            await subscriptionDao.updateSubscriptionByNo(event.data.id, {
                subscriptionStatus: SubscriptionStatus.Active,
            });

            // if (event.data.recurring) {
            //     await orderDao.update(event.data.order_id, {
            //         intervalCount: event.data.recurring.current_billing_cycles,
            //     });
            // }
        }
    }
}
