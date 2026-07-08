import { payssionProxy } from "@lib/repo/proxy/payment/payssion";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PaymentChannel, PayssionMandateStatus, PayssionSubscriptionStatus } from "@lib/common/consts/payment";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { logger } from "@lib/internal/logger";
// import { currentTime } from "@lib/common/utils/time";

export const subscriptionPaymentService = {
    runSubscriptionPayment: async () => {
        const subscriptionList = await subscriptionDao.getSubscriptionListByChannelAndStatus(PaymentChannel.Payssion, SubscriptionStatus.Active);

        for (const subscription of subscriptionList) {
            const payssionSubscriptionInfo = await payssionProxy.getSubscriptionInfo(subscription.subscriptionNo);
            const payssionMandateDetail = await payssionProxy.getMandateDetail(payssionSubscriptionInfo.mandate_id);
            logger.info(`Payssion subscription: ${payssionSubscriptionInfo.id} ${payssionSubscriptionInfo.status}; mandate ${payssionMandateDetail.id} is ${payssionMandateDetail.status}`);

            // 如果用户的授权已经取消 说明订阅也相应取消了 更新订阅状态为已取消
            if (payssionMandateDetail.status === PayssionMandateStatus.Canceled || payssionSubscriptionInfo.status === PayssionSubscriptionStatus.Incomplete) {
                subscriptionDao.updateSubscriptionById(subscription.id, { subscriptionStatus: SubscriptionStatus.Cancel });
            }

            // 如果授权和订阅状态正常则创建新的支付
            // if (payssionMandateDetail.status === PayssionMandateStatus.Succeeded && payssionSubscriptionInfo.status === PayssionSubscriptionStatus.Active) {
            //     const nextTime = currentTime() + 24 * 60 * 60 * 3;
            //     const periodEndTime = new Date(payssionSubscriptionInfo.time_current_period_end).getTime() / 1000;
            //     if (nextTime >= periodEndTime) {
            //         const paymentResult = await payssionProxy.createPaymentBySubscription({
            //             payment_method: payssionMandateDetail.payment_method,
            //             currency: payssionSubscriptionInfo.currency,
            //             amount: payssionSubscriptionInfo.amount,
            //             mandate_id: payssionMandateDetail.id,
            //         });

            //         if (paymentResult.error) {
            //             logger.error(JSON.stringify(paymentResult));
            //             continue;
            //         }


            //     }
            // }

        }
    }
}
