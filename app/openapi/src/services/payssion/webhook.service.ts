import { MemberDeliveryFactory } from "@app/order/member";
import { OrderStatus } from "@lib/common/consts/order";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import type { PayssionWebhookPaymentData, PayssionWebhookReq, PayssionWebhookSubscriptionData } from "@lib/common/dto/payssion";
import { orderDao } from "@lib/repo/dao/order.dao";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { subscriptionService } from "../payermax/subscription-service";
import { payssionProxy } from "@lib/repo/proxy/payment/payssion";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { productDao } from "@lib/repo/dao/product.dao";
import { currentTime } from "@lib/common/utils/time";

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
        const payssionSubscriptionInfo = await payssionProxy.getSubscriptionInfo(subscriptionNo);

        let orderInfo = await orderDao.getOrderByPaymentIdAndChannel(req.data.object.id, PaymentChannel.Payssion);
        if (!orderInfo) {
            const skuInfo = await skuDao.getSkuById(subscriptionInfo.skuId);
            const [productInfo] = await productDao.getProductListInIds([skuInfo.productId]);

            const orderId = await orderDao.addOrder({
                bizId: await orderBizIdGenerator.generate(),
                userId: subscriptionInfo.userId,
                amount: skuInfo.price,
                currency: productInfo.currency,
                skuId: skuInfo.id,
                productId: productInfo.id,
                pixelId: subscriptionInfo.pixelId,
                paymentId: req.data.object.id,
                subscriptionId: subscriptionInfo.id,
                subscriptionCount: payssionSubscriptionInfo.times_completed,
                paymentChannel: subscriptionInfo.subscriptionChannel,
                paymentType: PaymentType.Pix,
                orderType: skuInfo.skuType,
                orderStatus: OrderStatus.Completed,
                ad: '',
                createTime: currentTime(),
                updateTime: currentTime(),
            });

            orderInfo = await orderDao.getOrderById(orderId);
            await MemberDeliveryFactory.create(orderInfo).deliver();
        } else {
            await orderDao.updateOrderById(orderInfo.id, {
                paymentId: req.data.object.id,
                orderStatus: OrderStatus.Completed,
            });
            await MemberDeliveryFactory.create(orderInfo).deliver();

            const pixelInfo = await pixelDao.getPixelById(orderInfo.pixelId);
            await subscriptionService.sendFacebookEvent(pixelInfo, subscriptionInfo);
            if (payssionSubscriptionInfo.status === 'active') {
                await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
                    subscriptionStatus: SubscriptionStatus.Active,
                });

                await orderDao.updateOrderById(orderInfo.id, {
                    subscriptionCount: payssionSubscriptionInfo.times_completed,
                });
            }
        }
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

        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, {
            subscriptionStatus: SubscriptionStatus.Finish,
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
