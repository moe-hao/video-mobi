import { memberDelivery } from "@app/order/member";
import { OrderStatus } from "@lib/common/consts/order";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import type { PayssionWebhookPaymentData, PayssionWebhookReq, PayssionWebhookSubscriptionData } from "@lib/common/dto/payssion";
import { orderDao } from "@lib/repo/dao/order.dao";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";

export class PayssionWebhookService {
    async handle(req: PayssionWebhookReq) {
        const type = req.type;
        if (type === 'payment.succeeded') {
            await this.handlePaymentSucceeded(req);
        }

        if (type === 'payment.failed') {
            await this.handlePaymentFailed(req);
        }

        if (type === 'subscription.completed') {
            await this.handleSubscriptionCompleted(req);
        }

        if (type === 'subscription.canceled') {
            await this.handleSubscriptionCanceled(req);
        }
    }

    private async handlePaymentSucceeded(req: PayssionWebhookReq<PayssionWebhookPaymentData>) {
        const subscriptionNo = req.data.object.source_id;
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        const [orderInfo] = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);

        await orderDao.updateOrderById(orderInfo.id, {
            paymentId: req.data.object.id,
            orderStatus: OrderStatus.Completed,
        });

        await memberDelivery.deliver(orderInfo);
    }

    private async handlePaymentFailed(req: PayssionWebhookReq<PayssionWebhookPaymentData>) {
        const subscriptionNo = req.data.object.source_id;
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        const [orderInfo] = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);

        await orderDao.updateOrderById(orderInfo.id, {
            paymentId: req.data.object.id,
            orderStatus: OrderStatus.Failed,
        });
    }

    private async handleSubscriptionCompleted(req: PayssionWebhookReq<PayssionWebhookSubscriptionData>) {
        const subscriptionNo = req.data.object.id;
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        const [orderInfo] = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);

        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Active,
        });

        await orderDao.updateOrderById(orderInfo.id, {
            subscriptionCount: req.data.object.times_completed,
        });
    }

    private async handleSubscriptionCanceled(req: PayssionWebhookReq<PayssionWebhookSubscriptionData>) {
        const subscriptionNo = req.data.object.id;
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);

        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Cancel,
        });
    }
}

export const payssionWebhookService = new PayssionWebhookService();
