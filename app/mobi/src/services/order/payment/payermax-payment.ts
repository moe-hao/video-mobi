import { OrderStatus } from "@lib/common/consts/order";
import { PaymentChannel } from "@lib/common/consts/payment";
import type { Payment, PaymentInfo, PaymentOrder } from "./payment";
import { uuid } from "@lib/common/utils/uuid";
import { payermaxProxy } from "@lib/repo/proxy/payment";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PayermaxToSubscriptionStatus } from "@lib/common/consts/subscription";
import { orderDao } from "@lib/repo/dao/order.dao";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { SkuType } from "@lib/common/consts/sku";

export class PayermaxPayment implements Payment {
    private readonly orderPaymentChannel = PaymentChannel.Payermax;

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        let subscriptionId = 0;
        let subscriptionNo = "";

        if (paymentInfo.skuInfo.skuType === SkuType.Subscription) {
            const subscriptionResult = await this.createSubscription(paymentInfo);
            subscriptionId = subscriptionResult.subscriptionId;
            subscriptionNo = subscriptionResult.subscriptionNo;
        }

        const orderBizId = await orderBizIdGenerator.generate();
        const payermaxPaymentInfo = {
            userBizId: paymentInfo.userInfo.bizId,
            orderBizId: orderBizId,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            paymentChannel: this.orderPaymentChannel,
            paymentType: paymentInfo.paymentType,
            subscriptionNo: subscriptionNo,
            reback: paymentInfo.reback,
        }
        const paymentResult = await payermaxProxy.payOrder(paymentInfo.productInfo, payermaxPaymentInfo);
        const collectionBizId = (() => { try { return JSON.parse(paymentInfo.ad || "{}").collectionId || ""; } catch { return ""; } })();

        const orderId = await orderDao.addOrder({
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            paymentId: paymentResult.tradeToken,
            subscriptionId: subscriptionId,
            paymentChannel: this.orderPaymentChannel,
            paymentType: paymentInfo.paymentType,
            orderType: paymentInfo.skuInfo.skuType,
            orderStatus: OrderStatus.Pending,
            collectionBizId: collectionBizId,
            ad: paymentInfo.ad || "",
        });

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: subscriptionNo,
            paymentId: paymentResult.tradeToken,
            redirectUrl: paymentResult.redirectUrl,
        };
    }

    private async createSubscription(paymentInfo: PaymentInfo): Promise<{ subscriptionId: number, subscriptionNo: string }> {
        const subscriptionBizId = uuid();
        const subscriptionCreateResult = await payermaxProxy.createSubscription(
            paymentInfo.userInfo.bizId,
            subscriptionBizId,
            paymentInfo.productInfo,
            paymentInfo.skuInfo
        );

        const subscriptionId = await subscriptionDao.addSubscription({
            bizId: subscriptionBizId,
            userId: paymentInfo.userInfo.id,
            subscriptionNo: subscriptionCreateResult.subscriptionNo,
            subscriptionStatus: PayermaxToSubscriptionStatus[subscriptionCreateResult.subscriptionStatus],
            subscriptionChannel: this.orderPaymentChannel,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            ad: paymentInfo.ad || "",
        });

        const subscriptionNo = subscriptionCreateResult.subscriptionNo;
        return { subscriptionId, subscriptionNo };
    }
}
