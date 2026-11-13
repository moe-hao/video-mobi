import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import type { Operation } from "./operation";
import { antomProxy } from "@lib/repo/proxy/payment/antom";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { productDao } from "@lib/repo/dao/product.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";

export class AntomOperation implements Operation {
    async cancel(subscriptionInfo: SubscriptionSelect): Promise<void> {
        const [productInfo] = await productDao.getProductListInIds([subscriptionInfo.productId]);
        await antomProxy.cancelSubscription(productInfo.host, subscriptionInfo.subscriptionNo);
        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Cancel,
        });
    }
}
