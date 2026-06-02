import type { SubscriptionDetailResp } from "@lib/common/dto/subscription";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { SubscriptionOperationFactory } from "./operation/operation";
import type { PaymentChannel } from "@lib/common/consts/payment";
import type { UserAuthInfo } from "@lib/repo/redis/user";

class SubscriptionService {
    async getSubscriptionDetail(userInfo: UserAuthInfo): Promise<SubscriptionDetailResp> {
        const subscriptionInfoList = await subscriptionDao.getSubscriptionListByUserId(userInfo.id);
        for (const subscriptionInfo of subscriptionInfoList) {
            if (subscriptionInfo.subscriptionStatus === SubscriptionStatus.Active) {
                return {
                    isCanceled: false,
                };
            }
        }

        if (subscriptionInfoList.length > 0) {
            return {
                isCanceled: true,
            };
        }

        return {
            isCanceled: false,
        };
    }

    async cancel(userInfo: UserAuthInfo): Promise<void> {
        const subscriptionInfo = await subscriptionDao.getSubscriptionActiveByUserId(userInfo.id);
        if (subscriptionInfo) {
            const operation = SubscriptionOperationFactory.createOperation(subscriptionInfo.subscriptionChannel as PaymentChannel);
            await operation.cancel(subscriptionInfo);
        }
    }
}

export const subscriptionService = new SubscriptionService();
