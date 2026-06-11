import type { PaypalEventReourceSale, PaypalEventReq } from "@lib/common/dto/paypal";
import type { EventHandler } from "./event-handler";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PaypalEventType } from "@lib/common/consts/paypal";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { orderDao } from "@lib/repo/dao/order.dao";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { OrderStatus } from "@lib/common/consts/order";
import { memberDelivery } from "@app/order/member";
export class SaleEventHandler implements EventHandler {
    async handle(req: PaypalEventReq<PaypalEventReourceSale>): Promise<void> {
        switch (req.event_type) {
            case PaypalEventType.PaymentSaleCompleted:
                await this.handlePaymentSaleCompleted(req.resource);
                break;
        }
    }

    private async handlePaymentSaleCompleted(saleInfo: PaypalEventReourceSale): Promise<void> {
        if (saleInfo.billing_agreement_id) {
            const subscriptionNo = saleInfo.billing_agreement_id;
            const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);

            if (subscriptionInfo) {
                const subscriptionId = subscriptionInfo.id;
                const subscriptionOrderCount = await orderDao.getOrderCountBySubscriptionId(subscriptionId);

                const orderBizId = await orderBizIdGenerator.generate();
                await orderDao.addOrder({
                    bizId: orderBizId,
                    userId: subscriptionInfo.userId,
                    amount: saleInfo.amount.total,
                    skuId: subscriptionInfo.skuId,
                    productId: subscriptionInfo.productId,
                    paymentId: saleInfo.id,
                    subscriptionId: subscriptionId,
                    subscriptionCount: subscriptionOrderCount + 1,
                    paymentChannel: PaymentChannel.Paypal,
                    paymentType: PaymentType.Paypal,
                    orderStatus: OrderStatus.Paid
                });

                const orderInfo = await orderDao.getOrderByBizId(orderBizId);
                await memberDelivery.deliver(orderInfo);
                orderDao.updateOrderById(orderInfo.id, {
                    orderStatus: OrderStatus.Completed,
                });
            }
        }
    }
}
