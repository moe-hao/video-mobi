import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import type { Operation } from "./operation";
import { payermaxProxy } from "@lib/repo/proxy/payment";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";

export class PayermaxOperation implements Operation {
    async cancel(subscriptionInfo: SubscriptionSelect) {
        await payermaxProxy.cancelSubscription(subscriptionInfo.subscriptionNo);
        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Cancel,
        });
    }
}
