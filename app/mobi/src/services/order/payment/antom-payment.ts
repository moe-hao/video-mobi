import type { Payment, PaymentInfo, PaymentOrder } from "./payment";
import { antomProxy } from "@lib/repo/proxy/payment/antom";
import { orderDao } from "@lib/repo/dao/order.dao";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { PaymentChannel } from "@lib/common/consts/payment";
import { OrderStatus } from "@lib/common/consts/order";

export class AntomPayment implements Payment {
    private readonly orderPaymentChannel = PaymentChannel.Antom;

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        const collectionBizId = (() => { try { return JSON.parse(paymentInfo.ad || "{}").collectionId || ""; } catch { return ""; } })();
        const orderBizId = await orderBizIdGenerator.generate();
        const orderId = await orderDao.addOrder({
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.firstPeriodPrice !== '0.00' ? paymentInfo.skuInfo.firstPeriodPrice : paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            paymentId: '',
            subscriptionId: 0,
            paymentChannel: this.orderPaymentChannel,
            paymentType: paymentInfo.paymentType,
            orderType: paymentInfo.skuInfo.skuType,
            orderStatus: OrderStatus.Pending,
            collectionBizId: collectionBizId,
            ad: paymentInfo.ad || "",
        });

        const orderInfo = await orderDao.getOrderById(orderId);
        const redirectUrl = await antomProxy.createPaymentSession(paymentInfo.productInfo, paymentInfo.skuInfo, paymentInfo.paymentType, orderInfo, paymentInfo.reback);

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: '',
            paymentId: '',
            redirectUrl: redirectUrl,
        }
    }
}
