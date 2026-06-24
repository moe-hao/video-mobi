import { OrderStatus } from "@lib/common/consts/order";
import { PaymentChannel } from "@lib/common/consts/payment";
import type { Payment, PaymentApproveInfo, PaymentInfo, PaymentOrder } from "./payment";
import { uuid } from "@lib/common/utils/uuid";
import { payermaxProxy } from "@lib/repo/proxy/payment";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PayermaxToSubscriptionStatus } from "@lib/common/consts/subscription";
import { orderDao } from "@lib/repo/dao/order.dao";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";


export class PayermaxPayment implements Payment {
    private readonly orderPaymentChannel = PaymentChannel.Payermax;

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
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
        });

        const orderBizId = await orderBizIdGenerator.generate();
        const payermaxPaymentInfo = {
            userBizId: paymentInfo.userInfo.bizId,
            orderBizId: orderBizId,
            amount: paymentInfo.skuInfo.price,
            paymentChannel: this.orderPaymentChannel,
            paymentType: paymentInfo.paymentType,
            subscriptionNo: subscriptionCreateResult.subscriptionNo,
            reback: paymentInfo.reback,
        }
        const paymentResult = await payermaxProxy.payOrder(paymentInfo.productInfo, payermaxPaymentInfo);

        const orderId = await orderDao.addOrder({
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.productInfo.currency,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            paymentId: paymentResult.tradeToken,
            subscriptionId: subscriptionId,
            paymentChannel: this.orderPaymentChannel,
            paymentType: paymentInfo.paymentType,
            orderStatus: OrderStatus.Pending,
        });

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: subscriptionCreateResult.subscriptionNo,
            paymentId: paymentResult.tradeToken,
            redirectUrl: paymentResult.redirectUrl,
        };
    }

    async approveOrder(approveInfo: PaymentApproveInfo): Promise<void> {
        throw new InternalException(ResultCode.MethodNotSupported);
    }

    async closeOrder(paymentId: string): Promise<void> {
        throw new InternalException(ResultCode.MethodNotSupported);
    }

    async completeOrder(paymentId: string): Promise<void> {
        throw new InternalException(ResultCode.MethodNotSupported);
    }

    async failedOrder(paymentId: string): Promise<void> {
        throw new InternalException(ResultCode.MethodNotSupported);
    }
}
