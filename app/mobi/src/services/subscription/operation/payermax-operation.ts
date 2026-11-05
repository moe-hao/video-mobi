import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import type { Operation } from "./operation";
import { payermaxProxy } from "@lib/repo/proxy/payment/payermax";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { productDao } from "@lib/repo/dao/product.dao";

export class PayermaxOperation implements Operation {
    async cancel(subscriptionInfo: SubscriptionSelect) {
        const [productInfo] = await productDao.getProductListInIds([subscriptionInfo.productId]);
        await payermaxProxy.cancelSubscription(productInfo.host, subscriptionInfo.subscriptionNo);
        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Cancel,
        });
    }
}
