import { payssionProxy } from "@lib/repo/proxy/payment";
import type { Payment, PaymentApproveInfo, PaymentInfo, PaymentOrder } from "./payment";
import { SkuPeriodType, SkuPeriodTypeToPayssionPeriodType } from "@lib/common/consts/sku";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { uuid } from "@lib/common/utils/uuid";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { PaymentChannel } from "@lib/common/consts/payment";
import { orderDao } from "@lib/repo/dao/order.dao";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { OrderStatus } from "@lib/common/consts/order";

export class PayssionPayment implements Payment {
    private readonly orderPaymentChannel = PaymentChannel.Payssion;

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        const customer = await payssionProxy.createCustomer({
            document: {
                country: 'BR',
                type: 'tax_id',
                number: paymentInfo.pixCPF,
            },
            first_name: paymentInfo.firstName,
            last_name: paymentInfo.lastName,
        });

        const periodType = SkuPeriodTypeToPayssionPeriodType[paymentInfo.skuInfo.periodType as SkuPeriodType];

        const pathURL = new URL(`https://${paymentInfo.productInfo.host}${paymentInfo.reback}`);
        const collectionId = pathURL.searchParams.get('collectionId');
        const episode = pathURL.searchParams.get('episode');
        const path = pathURL.pathname;

        let url = `https://${paymentInfo.productInfo.host}${path}`;
        if (collectionId) {
            url += `?collectionId=${collectionId}`;
        }
        if (episode) {
            url += `&episode=${episode}`;
        }

        const mandate = await payssionProxy.createCustomerMandate(customer.id, url, periodType);
        const subscription = await payssionProxy.createSubscription({
            mandate_id: mandate.id,
            currency: paymentInfo.productInfo.currency,
            amount: paymentInfo.skuInfo.price,
            interval_unit: periodType,
            times: paymentInfo.skuInfo.periodTotal,
        });

        const subscriptionId = await subscriptionDao.addSubscription({
            bizId: uuid(),
            userId: paymentInfo.userInfo.id,
            subscriptionNo: subscription.id,
            subscriptionStatus: SubscriptionStatus.InActive,
            subscriptionChannel: this.orderPaymentChannel,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            ad: paymentInfo.ad || "",
        });

        const orderBizId = await orderBizIdGenerator.generate();
        const orderId = await orderDao.addOrder({
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.productInfo.currency,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            orderType: paymentInfo.skuInfo.skuType,
            paymentId: "",
            subscriptionId: subscriptionId,
            paymentChannel: this.orderPaymentChannel,
            paymentType: paymentInfo.paymentType,
            orderStatus: OrderStatus.Pending,
            ad: paymentInfo.ad || "",
        })

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: subscription.id,
            paymentId: '',
            redirectUrl: subscription.mandate.action.redirect_to_url.url,
        };
    }

    approveOrder(approveInfo: PaymentApproveInfo): Promise<void> {
        throw new Error("Method not implemented.");
    }

    closeOrder(paymentId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    completeOrder(paymentId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    failedOrder(paymentId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
