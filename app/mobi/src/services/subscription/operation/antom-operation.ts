import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import type { Operation } from "./operation";
import { antomProxy } from "@lib/repo/proxy/payment/antom";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";

export class AntomOperation implements Operation {
    async cancel(subscriptionInfo: SubscriptionSelect): Promise<void> {
        await antomProxy.cancelSubscription(subscriptionInfo.subscriptionNo);
        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Cancel,
        });
    }
}
