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
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { PixelPlatform } from "@lib/common/consts/pixel";
import { subscriptionService } from "../payermax/subscription-service";
import { logger } from "@lib/internal/logger";

enum PaymentResultStatus {
    Success = 'S',
    Failed = 'F',
}

export async function receive(req: AntomPaymentNotificationReq): Promise<void> {
    if (req.notifyType === AntomNotifyType.PaymentResult) {
        // 当 subscriptionRequestId 和 subscriptionId 存在的时候 说明是订阅结果相关内容
        if (req.subscriptionRequestId && req.subscriptionId) {
            await receivePaymentResultForSubscription(req);
            return;
        }

        // 当 paymentRequestId 和 paymentId 存在的时候 说明是支付结果相关内容
        if (req.paymentRequestId && req.paymentId) {
            await receivePaymentResultForPayment(req);
            return;
        }
    }

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
}

async function receivePaymentResultForSubscription(req: AntomPaymentNotificationReq): Promise<void> {
    const subscriptionNo = req.subscriptionId;
    const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);

    if (!subscriptionInfo) {
        const orderBizId = req.subscriptionRequestId;
        const orderInfo = await orderDao.getOrderByBizId(orderBizId);

        let subscriptionStatus = SubscriptionStatus.Active;
        if (req.result.resultStatus === PaymentResultStatus.Failed) {
            subscriptionStatus = SubscriptionStatus.ActiveFailed;
        }

        const subscriptionId = await subscriptionDao.addSubscription({
            bizId: uuid(),
            userId: orderInfo.userId,
            subscriptionNo: req.subscriptionId,
            subscriptionStatus: subscriptionStatus,
            subscriptionChannel: PaymentChannel.Antom,
            skuId: orderInfo.skuId,
            productId: orderInfo.productId,
            pixelId: orderInfo.pixelId,
            ad: orderInfo.ad || '',
        });

        await orderDao.updateOrderById(orderInfo.id, {
            subscriptionId: subscriptionId,
            subscriptionCount: Number(req.phaseNo) || 0,
        });
    } else {
        // 获取最初的订阅
        const orderBizId = req.subscriptionRequestId;
        const firstOrderInfo = await orderDao.getOrderByBizId(orderBizId);

        // 续费的订单添加并下发权益
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
            paymentType: firstOrderInfo.paymentType,
            orderType: firstOrderInfo.orderType,
            orderStatus: OrderStatus.Paid,
            ad: subscriptionInfo.ad || '',
        });

        const orderInfo = await orderDao.getOrderById(orderId);
        await MemberDeliveryFactory.create(orderInfo).deliver();

        await orderDao.updateOrderById(orderInfo.id, {
            orderStatus: OrderStatus.Completed,
        });
    }
}

async function receivePaymentResultForPayment(req: AntomPaymentNotificationReq): Promise<void> {
    const orderBizId = req.paymentRequestId;
    const orderInfo = await orderDao.getOrderByBizId(orderBizId);
    if (orderInfo) {
        // 结果为成功
        if (req.result.resultStatus === PaymentResultStatus.Success) {
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
        // 结果为失败
        if (req.result.resultStatus === PaymentResultStatus.Failed) {
            await orderDao.updateOrderById(orderInfo.id, {
                orderStatus: OrderStatus.Failed,
            });
        }
    }
}
