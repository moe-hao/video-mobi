import { PaymentChannel } from "@lib/common/consts/payment";
import type { Payment, PaymentInfo, PaymentOrder } from "./payment";
import { SkuType } from "@lib/common/consts/sku";
import { SubscriptionStatus, type PeriodType } from "@lib/common/consts/subscription";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { uuid } from "@lib/common/utils/uuid";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";
import { addMinutes, format } from "date-fns";
import { useePayProxy } from "@lib/repo/proxy/payment/useepay/proxy";
import { getUseePaySubscriptionInterval } from "@lib/repo/proxy/payment/useepay/internal";
// import type { CreatePaymentIntentPaymentMethodDataReq } from "@lib/repo/proxy/payment/useepay/types";

export class UseePayPayment implements Payment {
    private readonly orderPaymentChannel = PaymentChannel.UseePay;

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        // const customerInfo = await useePayProxy.createCustomer({
        //     merchantCustomerId: `${paymentInfo.userInfo.id}-${uuid()}`,
        //     name: paymentInfo.userInfo.bizId,
        //     email: paymentInfo.userInfo.bizId + "@bluearcshow.com",
        // });

        let { subscriptionId, subscriptionNo, invoiceId } = { subscriptionId: 0, subscriptionNo: "", invoiceId: "" };
        if (paymentInfo.skuInfo.skuType === SkuType.Subscription) {
            const createSubscriptionResult = await this.createSubscription("customerInfo.id", paymentInfo);
            subscriptionId = createSubscriptionResult.subscriptionId;
            subscriptionNo = createSubscriptionResult.subscriptionNo;

            const createInvoiceResult = await useePayProxy.createInvoice({
                currency: paymentInfo.skuInfo.currency,
                totalAmount: paymentInfo.skuInfo.price,
                // customerId: "customerInfo.id",
                subscriptionId: subscriptionNo,
            });
            invoiceId = createInvoiceResult.id;
        }

        return await this.createPaymentIntent("customerInfo.id", invoiceId, subscriptionId, subscriptionNo, paymentInfo);
    }

    async createSubscription(customerId: string, paymentInfo: PaymentInfo): Promise<{ subscriptionId: number, subscriptionNo: string }> {
        const useePaySubscriptionInfo = await useePayProxy.createSubscription({
            // customerId: customerId,
            currency: paymentInfo.skuInfo.currency,
            currentPeriodStart: format(addMinutes(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss+08:00"),
            recurring: {
                interval: getUseePaySubscriptionInterval(paymentInfo.skuInfo.periodType as PeriodType),
                unitAmount: paymentInfo.skuInfo.price,
                intervalCount: 1,
                totalBillingCycles: paymentInfo.skuInfo.periodTotal,
            }
        });

        const subscriptionNo = useePaySubscriptionInfo.id;
        const subscriptionId = await subscriptionDao.addSubscription({
            bizId: uuid(),
            userId: paymentInfo.userInfo.id,
            subscriptionNo: subscriptionNo,
            subscriptionStatus: SubscriptionStatus.InActive,
            subscriptionChannel: this.orderPaymentChannel,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            ad: paymentInfo.ad || "",
        });

        return {
            subscriptionId: subscriptionId,
            subscriptionNo: subscriptionNo,
        }
    }

    async createPaymentIntent(customerId: string, invoiceId: string, subscriptionId: number, subscriptionNo: string, paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        // const paymentMethodDataBilling = {
        //     address: { country: "BR" }
        // }

        // const paymentMethodDataPix = {
        //     identificationNumber: paymentInfo.pixCPF,
        // }

        // const paymentMethodData: CreatePaymentIntentPaymentMethodDataReq = {
        //     type: "card",
        //     firstName: paymentInfo.firstName,
        //     lastName: paymentInfo.lastName,
        //     billing: paymentMethodDataBilling,
        //     pix: paymentMethodDataPix,
        // }

        // const deviceData = {
        //     ipAddress: "127.0.0.1",
        // }

        const orderBizId = await orderBizIdGenerator.generate();
        const useePayPaymentInfo = await useePayProxy.createPaymentIntent({
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            merchantOrderId: orderBizId,
            // confirm: true,
            autoCapture: true,
            mode: paymentInfo.skuInfo.skuType === SkuType.Subscription ? "subscription" : "payment",
            invoiceId: invoiceId,
            subscriptionId: subscriptionNo,
            // customerId: customerId,
            returnUrl: `https://${paymentInfo.productInfo.host}${paymentInfo.reback}`,
            // paymentMethodData: paymentMethodData,
            // deviceData: deviceData,
        });

        const collectionBizId = (() => { try { return JSON.parse(paymentInfo.ad || "{}").collectionId || ""; } catch { return ""; } })();
        const orderId = await orderDao.addOrder({
            bizId: orderBizId,
            userId: paymentInfo.userInfo.id,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            skuId: paymentInfo.skuInfo.id,
            productId: paymentInfo.productInfo.id,
            pixelId: paymentInfo.pixelId,
            paymentId: useePayPaymentInfo.id,
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
            paymentId: useePayPaymentInfo.id,
            redirectUrl: useePayPaymentInfo.nextAction?.redirect?.url || "",
        }
    }
}
