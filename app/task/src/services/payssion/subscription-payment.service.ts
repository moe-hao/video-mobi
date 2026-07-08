import { payssionProxy } from "@lib/repo/proxy/payment/payssion";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PaymentChannel, PayssionMandateStatus, PayssionSubscriptionStatus } from "@lib/common/consts/payment";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { logger } from "@lib/internal/logger";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";
import { currentTime } from "@lib/common/utils/time";
import { memberDao } from "@lib/repo/dao/member.dao";

export const subscriptionPaymentService = {
    asyncSubscriptionStatus: async () => {
        const subscriptionList = await subscriptionDao.getSubscriptionListByChannelAndStatus(PaymentChannel.Payssion, SubscriptionStatus.Active);

        for (const subscription of subscriptionList) {
            const payssionSubscriptionInfo = await payssionProxy.getSubscriptionInfo(subscription.subscriptionNo);
            const payssionMandateDetail = await payssionProxy.getMandateDetail(payssionSubscriptionInfo.mandate_id);
            logger.info(`Payssion subscription: ${payssionSubscriptionInfo.id} ${payssionSubscriptionInfo.status}; mandate ${payssionMandateDetail.id} is ${payssionMandateDetail.status}`);

            // 如果用户的授权已经取消 说明订阅也相应取消了 更新订阅状态为已取消
            if (payssionMandateDetail.status === PayssionMandateStatus.Canceled || payssionSubscriptionInfo.status === PayssionSubscriptionStatus.Incomplete) {
                subscriptionDao.updateSubscriptionById(subscription.id, { subscriptionStatus: SubscriptionStatus.Cancel });
            }
        }
    },

    // 关闭过期 payssion 订单
    closeExpiredPayment: async () => {
        const expiredTime = currentTime() - 60 * 60;
        const orderList = await orderDao.getOrderByChannelAndStatus(PaymentChannel.Payssion, OrderStatus.Pending, expiredTime);

        for (const order of orderList) {
            logger.info(`Close expired order: ${order.id}`);
            orderDao.updateOrderById(order.id, { orderStatus: OrderStatus.Closed });
        }
    },

    createSubscriptionPayment: async () => {
        const subscriptionNoList = ['sub_KWzfT4WvvrL8qjzv', 'sub_8y9KCGKaHeHC5qDa', 'sub_vDGCKOSWjbLCnfj9', 'sub_n5aLC4HqXzT8WHib', 'sub_iTurL8azXj1SnLKC', 'sub_bzvvnLaLmzb1KenX', 'sub_z50CWPzf1mn1iLGq', 'sub_SmbDyPuvD4WPffv5', 'sub_0uHe1SG8mfnD54GO', 'sub_LGKW9Cmzvv1OT8ib', 'sub_ePSqLGfjb9WPjnv1', 'sub_SmH0e1GGO0KGrrDS']
        for (const subscriptionNo of subscriptionNoList) {
            const payssionSubscriptionInfo = await payssionProxy.getSubscriptionInfo(subscriptionNo);
            const payssionMandateDetail = await payssionProxy.getMandateDetail(payssionSubscriptionInfo.mandate_id);
            const subscription = await subscriptionDao.getSubscriptionByNo(subscriptionNo);

            // 如果用户的授权已经取消 说明订阅也相应取消了 更新订阅状态为已取消
            if (payssionMandateDetail.status === PayssionMandateStatus.Canceled || payssionSubscriptionInfo.status === PayssionSubscriptionStatus.Incomplete) {
                subscriptionDao.updateSubscriptionById(subscription.id, { subscriptionStatus: SubscriptionStatus.Cancel });
            } else {
                const triadEndDate = new Date(payssionSubscriptionInfo.time_current_period_end);
                triadEndDate.setDate(triadEndDate.getDate() + 7);
                const result = await payssionProxy.createSubscription({
                    mandate_id: payssionSubscriptionInfo.mandate_id,
                    currency: payssionSubscriptionInfo.currency,
                    amount: payssionSubscriptionInfo.amount,
                    interval_unit: 'week',
                    times: 150,
                    time_trial_end: triadEndDate.toISOString().split('T')[0]
                });

                await subscriptionDao.updateSubscriptionById(subscription.id, { subscriptionNo: result.id });
                const memberInfo = await memberDao.getMemberByUserId(subscription.userId);
                await memberDao.updateMemberByUserId(subscription.userId, { expireTime: memberInfo.expireTime + 7 * 24 * 60 * 60 });
                await payssionProxy.cancelSubscription(subscriptionNo);
            }
        }
    }
}
