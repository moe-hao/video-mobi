import { PaymentChannel } from "@lib/common/consts/payment";
import type { Payment, PaymentInfo, PaymentOrder } from "./payment";
import { SkuType } from "@lib/common/consts/sku";
import { getUseePaySubscriptionInterval, useePayProxy } from "@lib/repo/proxy/payment/useepay";
import { SubscriptionStatus, type PeriodType } from "@lib/common/consts/subscription";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { uuid } from "@lib/common/utils/uuid";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";

export class UseePayPayment implements Payment {
    private readonly orderPaymentChannel = PaymentChannel.UseePay;

    async createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder> {
        let subscriptionNo = "";
        let subscriptionId = 0;

        const customerInfo = await useePayProxy.createCustomer({
            merchant_customer_id: uuid(),
            name: paymentInfo.userInfo.bizId,
            email: paymentInfo.userInfo.bizId + "@bluearcshow.com",
        });

        if (paymentInfo.skuInfo.skuType === SkuType.Subscription) {
            const now = new Date();
            now.setSeconds(now.getSeconds() + 5); // 加 5 秒确保大于当前时间
            const currentPeriodStart = now.toISOString().slice(0, 19) + 'Z';
            const useePaySubscriptionInfo = await useePayProxy.createSubscription({
                customer_id: customerInfo.id,
                currency: paymentInfo.skuInfo.currency,
                current_period_start: currentPeriodStart,
                recurring: {
                    interval: getUseePaySubscriptionInterval(paymentInfo.skuInfo.periodType as PeriodType),
                    unit_amount: paymentInfo.skuInfo.price,
                    interval_count: 1,
                    total_billing_cycles: paymentInfo.skuInfo.periodTotal,
                }
            });

            subscriptionNo = useePaySubscriptionInfo.id;
            subscriptionId = await subscriptionDao.addSubscription({
                bizId: uuid(),
                userId: paymentInfo.userInfo.id,
                subscriptionNo: subscriptionNo,
                subscriptionStatus: SubscriptionStatus.InActive,
                subscriptionChannel: this.orderPaymentChannel,
                skuId: paymentInfo.skuInfo.id,
                productId: paymentInfo.productInfo.id,
                pixelId: paymentInfo.pixelId,
                ad: paymentInfo.ad || "",
            })
        }

        const orderBizId = await orderBizIdGenerator.generate();
        const useePayPaymentInfo = await useePayProxy.createPaymentIntent({
            merchant_order_id: orderBizId,
            amount: paymentInfo.skuInfo.price,
            currency: paymentInfo.skuInfo.currency,
            customer_id: customerInfo.id,
            confirm: true,
            auto_capture: true,
            mode: paymentInfo.skuInfo.skuType === SkuType.Subscription ? "subscription" : "payment",
            return_url: `https://${paymentInfo.productInfo.host}${paymentInfo.reback}`,
            payment_method_data: {
                type: "pix",
                fisrt_name: paymentInfo.firstName,
                last_name: paymentInfo.lastName,
                billing: {
                    address: { country: "BR" }
                },
                pix: {
                    identification_number: paymentInfo.pixCPF,
                },
            },
            device_data: {
                ip_address: "127.0.0.1",
            }
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
        })

        return {
            orderId: orderId,
            orderBizId: orderBizId,
            subscriptionNo: subscriptionNo,
            paymentId: useePayPaymentInfo.id,
            redirectUrl: useePayPaymentInfo.next_action.redirect.url
        }
    }
}
