import { MemberDeliveryFactory } from "@app/order/member";
import { AntomNotifyType, AntomSubscriptionNotificationType } from "@lib/common/consts/antom";
import { OrderStatus } from "@lib/common/consts/order";
import type { AntomPaymentNotificationReq } from "@lib/common/dto/antom";
import { orderDao } from "@lib/repo/dao/order.dao";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { uuid } from "@lib/common/utils/uuid";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { PaymentChannel } from "@lib/common/consts/payment";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { antomValueRatio } from "@lib/repo/proxy/payment/antom";
import { SkuType } from "@lib/common/consts/sku";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { PixelPlatform } from "@lib/common/consts/pixel";
import { subscriptionService } from "../payermax/subscription-service";
import { logger } from "@lib/internal/logger";

export async function receive(req: AntomPaymentNotificationReq): Promise<void> {
    switch (req.notifyType) {
        case AntomNotifyType.PaymentResult:
            if (req.subscriptionRequestId && req.subscriptionId) {
                const orderBizId = req.subscriptionRequestId;
                const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(req.subscriptionId);
                if (!subscriptionInfo) {
                    const orderInfo = await orderDao.getOrderByBizId(orderBizId);
                    const subscriptionId = await subscriptionDao.addSubscription({
                        bizId: uuid(),
                        userId: orderInfo.userId,
                        subscriptionNo: req.subscriptionId,
                        subscriptionStatus: SubscriptionStatus.Active,
                        subscriptionChannel: PaymentChannel.Antom,
                        skuId: orderInfo.skuId,
                        productId: orderInfo.productId,
                        pixelId: orderInfo.pixelId,
                        ad: orderInfo.ad,
                    });
                    await orderDao.updateOrderById(orderInfo.id, {
                        subscriptionId: subscriptionId,
                        subscriptionCount: Number(req.phaseNo) || 0,
                    });
                } else {
                    const [lastOrderInfo] = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);
                    const orderId = await orderDao.addOrder({
                        bizId: await orderBizIdGenerator.generate(),
                        userId: subscriptionInfo.userId,
                        amount: (Number(req.paymentAmount.value) / (antomValueRatio.get(req.paymentAmount.currency) || 100)).toString(),
                        currency: req.paymentAmount.currency,
                        skuId: subscriptionInfo.skuId,
                        productId: subscriptionInfo.productId,
                        pixelId: subscriptionInfo.pixelId,
                        paymentId: req.paymentId,
                        subscriptionId: subscriptionInfo.id,
                        subscriptionCount: Number(req.phaseNo) || 0,
                        paymentChannel: PaymentChannel.Antom,
                        paymentType: lastOrderInfo.paymentType,
                        orderType: SkuType.Subscription,
                        orderStatus: OrderStatus.Completed,
                        ad: subscriptionInfo.ad || '',
                    });

                    const orderInfo = await orderDao.getOrderById(orderId);
                    await MemberDeliveryFactory.create(orderInfo).deliver();
                }
            }
            break;
        case AntomNotifyType.CaptureResult:
            const orderBizId = req.captureRequestId;
            if (orderBizId) {
                const orderInfo = await orderDao.getOrderByBizId(orderBizId);
                if (orderInfo) {
                    await orderDao.updateOrderById(orderInfo.id, {
                        paymentId: req.paymentId,
                        orderStatus: OrderStatus.Paid,
                    });

                    await MemberDeliveryFactory.create(orderInfo).deliver();
                    await orderDao.updateOrderById(orderInfo.id, {
                        orderStatus: OrderStatus.Completed,
                    });

                    const pixelInfo = await pixelDao.getPixelById(orderInfo.pixelId);
                    if (pixelInfo) {
                        if (pixelInfo.platfrom === PixelPlatform.Facebook) {
                            await subscriptionService.sendFacebookEventCoin(pixelInfo, orderInfo);
                        }

                        if (pixelInfo.platfrom === PixelPlatform.TikTok) {
                            await subscriptionService.sendTikTokEventCoin(pixelInfo, orderInfo);
                        }
                    }
                }
            }
            break;
        default:
            if (req.subscriptionNotificationType === AntomSubscriptionNotificationType.Cancel && req.subscriptionId) {
                await subscriptionDao.updateSubscriptionByNo(req.subscriptionId, {
                    subscriptionStatus: SubscriptionStatus.Cancel,
                });
                logger.info(`subscriptionNo: ${req.subscriptionId}, canel.`);
            }

            if (req.subscriptionNotificationType === AntomSubscriptionNotificationType.Terminate && req.subscriptionId) {
                await subscriptionDao.updateSubscriptionByNo(req.subscriptionId, {
                    subscriptionStatus: SubscriptionStatus.Terminate,
                });
                logger.info(`subscriptionNo: ${req.subscriptionId}, terminate.`);

            }
            break;
    }
}
