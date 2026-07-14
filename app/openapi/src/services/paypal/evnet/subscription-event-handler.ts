import type { PaypalEventReourceSubscription, PaypalEventReq } from "@lib/common/dto/paypal";
import type { EventHandler } from "./event-handler";
import { PaypalEventType } from "@lib/common/consts/paypal";
import { logger } from "@lib/internal/logger";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { userDao } from "@lib/repo/dao/user.dao";
import { PaymentChannel } from "@lib/common/consts/payment";

export class SubscriptionEventHandler implements EventHandler {
    async handle(req: PaypalEventReq<PaypalEventReourceSubscription>): Promise<void> {
        const subscriptionNo = req.resource.id;
        switch (req.event_type) {
            case PaypalEventType.BillingSubscriptionCreated:
                await this.handleBillingSubscriptionCreated(req.resource.custom_id, subscriptionNo);
                break;
            case PaypalEventType.BillingSubscriptionActivated:
                await this.handleBillingSubscriptionActivated(subscriptionNo);
                break;
        }
    }

    private async handleBillingSubscriptionCreated(userBizId: string, subscriptionNo: string): Promise<void> {
        logger.info(`handleBillingSubscriptionCreated: ${userBizId}, ${subscriptionNo}`);
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        if (!subscriptionInfo) {
            const userInfo = await userDao.getUserInfoByBizId(userBizId);
            if (!userInfo) {
                throw new InternalException(ResultCode.ResourceNotFound.code, `CustomId: User Info Not Found: ${userBizId}`);
            }

            await subscriptionDao.addSubscription({
                userId: userInfo.id,
                subscriptionNo: subscriptionNo,
                subscriptionStatus: SubscriptionStatus.InActive,
                subscriptionChannel: PaymentChannel.Paypal,
                ad: "",
            });
        }
    }

    private async handleBillingSubscriptionActivated(subscriptionNo: string): Promise<void> {
        logger.info(`handleBillingSubscriptionActivated: ${subscriptionNo}`);
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        if (subscriptionInfo && subscriptionInfo.subscriptionStatus === SubscriptionStatus.InActive) {
            await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
                subscriptionStatus: SubscriptionStatus.Active,
            });
        }
    }
}
