import { payssionProxy } from "@lib/repo/proxy/payment/payssion";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PaymentChannel, PayssionMandateStatus, PayssionSubscriptionStatus } from "@lib/common/consts/payment";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { logger } from "@lib/internal/logger";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";
import { currentTime } from "@lib/common/utils/time";

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
    }
}
