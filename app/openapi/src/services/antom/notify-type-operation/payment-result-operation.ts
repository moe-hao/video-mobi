import type { AntomPaymentNotificationReq } from "@lib/common/dto/antom";
import { AntomResultStatus, type INotifyTypeOperation } from "./notify-type-operation";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { orderDao } from "@lib/repo/dao/order.dao";
import { uuid } from "@lib/common/utils/uuid";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { PaymentChannel } from "@lib/common/consts/payment";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import { antomValueRatio } from "@lib/repo/proxy/payment/antom";
import { SkuType } from "@lib/common/consts/sku";
import { OrderStatus } from "@lib/common/consts/order";
import { MemberDeliveryFactory } from "@app/order/member";

export class PaymentResultOperation implements INotifyTypeOperation {
    constructor(private readonly content: AntomPaymentNotificationReq) { }

    async do(): Promise<void> {
        if (this.content.subscriptionRequestId && this.content.subscriptionId && this.content.result?.resultStatus === AntomResultStatus.Success) {
            await this.handleSubscription();
        }
    }

    private async handleSubscription() {
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(this.content.subscriptionId);

        if (!subscriptionInfo) {
            await this.handleFirstSubscription();
        } else {
            await this.handleNextSubscription(subscriptionInfo);
        }
    }

    private async handleFirstSubscription(): Promise<void> {
        const orderBizId = this.content.subscriptionRequestId;
        const orderInfo = await orderDao.getOrderByBizId(orderBizId);

        const subscriptionId = await subscriptionDao.addSubscription({
            bizId: uuid(),
            userId: orderInfo.userId,
            subscriptionNo: this.content.subscriptionId,
            subscriptionStatus: SubscriptionStatus.Active,
            subscriptionChannel: PaymentChannel.Antom,
            skuId: orderInfo.skuId,
            productId: orderInfo.productId,
            pixelId: orderInfo.pixelId,
            ad: orderInfo.ad || '',
        });

        await orderDao.updateOrderById(orderInfo.id, {
            subscriptionId: subscriptionId,
            subscriptionCount: Number(this.content.phaseNo) || 0,
        });
    }

    private async handleNextSubscription(subscriptionInfo: SubscriptionSelect): Promise<void> {
        const orderBizId = this.content.subscriptionRequestId;
        const originalOrderInfo = await orderDao.getOrderByBizId(orderBizId);

        const orderAmount = (Number(this.content.paymentAmount.value) / (antomValueRatio.get(this.content.paymentAmount.currency) || 100)).toString();
        const orderId = await orderDao.addOrder({
            bizId: await orderBizIdGenerator.generate(),
            userId: subscriptionInfo.userId,
            amount: orderAmount,
            currency: this.content.paymentAmount.currency,
            skuId: subscriptionInfo.skuId,
            productId: subscriptionInfo.productId,
            pixelId: subscriptionInfo.pixelId,
            paymentId: this.content.paymentId,
            subscriptionId: subscriptionInfo.id,
            subscriptionCount: Number(this.content.phaseNo) || 0,
            paymentChannel: PaymentChannel.Antom,
            paymentType: originalOrderInfo?.paymentType || '',
            orderType: SkuType.Subscription,
            orderStatus: OrderStatus.Completed,
            ad: subscriptionInfo.ad || '',
        });

        const orderInfo = await orderDao.getOrderById(orderId);
        await MemberDeliveryFactory.create(orderInfo).deliver();
    }
}
