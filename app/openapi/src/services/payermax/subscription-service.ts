import type { OrderPayermaxResultResp, PayermaxNotificationReq, PayermaxSubscriptionNotificationData, PayermaxSubscriptionNotificationPaymentDetail } from "@lib/common/dto/payermax";
import { orderStatusHelper } from "./order/order-status-helper";
import { PayermaxNotifyType, PayermaxResponseCode, PayermaxResultToStatus } from "@lib/common/consts/payermax";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { PayermaxToSubscriptionStatus, SubscriptionFinalStatus, SubscriptionStatus } from "@lib/common/consts/subscription";
import { logger } from "@lib/internal/logger";
import { PaymentChannel } from "@lib/common/consts/payment";
import { orderDao } from "@lib/repo/dao/order.dao";
import { productDao } from "@lib/repo/dao/product.dao";
import { orderBizIdGenerator } from "@app/order/order/order-biz-id-generator";
import { OrderFinalState } from "@lib/common/consts/order";
import { CustomData, EventRequest, ServerEvent, UserData } from "facebook-nodejs-business-sdk"
import { currentTime } from "@lib/common/utils/time";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import type { PixelSelect } from "@lib/repo/models/pixel";
import { PixelPlatform, TikTokEvent } from "@lib/common/consts/pixel";
import { tikTokBusinessProxy } from "@lib/repo/proxy/tiktok/business";
import type { SubscriptionSelect } from "@lib/repo/models/subscription";

class SubscriptionService {
    async receive(req: PayermaxNotificationReq<PayermaxSubscriptionNotificationData>): Promise<OrderPayermaxResultResp> {
        if (req.notifyType === PayermaxNotifyType.Subscription && req.data.subscriptionPlan.subscriptionStatus) {
            await this.processSubscriptionStatus(req);
        }

        if (req.notifyType === PayermaxNotifyType.SubscriptionPayment) {
            await this.processSubscriptionPayment(req);
        }

        return { code: PayermaxResponseCode.Success, msg: 'Success' }
    }

    private async processSubscriptionStatus(req: PayermaxNotificationReq<PayermaxSubscriptionNotificationData>) {
        const subscriptionNo = req.data.subscriptionPlan.subscriptionNo;
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        const targetStatus = PayermaxToSubscriptionStatus[req.data.subscriptionPlan.subscriptionStatus];
        logger.info(`SubscriptionService.processSubscriptionStatus, subscriptionNo:${subscriptionNo}, targetStatus:${targetStatus}`);

        if (subscriptionInfo && !SubscriptionFinalStatus.includes(subscriptionInfo.subscriptionStatus)) {
            switch (targetStatus) {
                case SubscriptionStatus.Active:
                    if (subscriptionInfo.subscriptionStatus === SubscriptionStatus.InActive) {
                        logger.info(`SubscriptionService.processSubscriptionStatus, subscriptionNo:${subscriptionNo}, targetStatus:${targetStatus}, update to active`);
                        await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, { subscriptionStatus: targetStatus });
                        if (subscriptionInfo.pixelId !== 0) {
                            logger.info(`SubscriptionService.processSubscriptionStatus, subscriptionNo:${subscriptionNo}, targetStatus:${targetStatus}, update to active, pixelId:${subscriptionInfo.pixelId}`);

                            const pixel = await pixelDao.getPixelById(subscriptionInfo.pixelId);
                            if (pixel.platfrom === PixelPlatform.Facebook) {
                                await this.sendFacebookEvent(subscriptionInfo.userId, pixel, req.data.subscriptionPaymentDetail);
                            }

                            if (pixel.platfrom === PixelPlatform.TikTok) {
                                await this.sendTikTokEvent(pixel, subscriptionInfo);
                            }
                        }
                    }
                    break;
                default:
                    await subscriptionDao.updateSubscriptionById(subscriptionInfo.id, { subscriptionStatus: targetStatus });
                    break;
            }
        }
    }

    async sendFacebookEvent(userId: number, pixel: PixelSelect, subscriptionPaymentDetail: PayermaxSubscriptionNotificationPaymentDetail) {
        const fbUserData = new UserData().setAppUserId(userId.toString());
        const fbCustomData = new CustomData().setCurrency(subscriptionPaymentDetail?.payAmount?.currency || 'USD').setValue(Number(subscriptionPaymentDetail?.payAmount?.amount || '0'));
        const fbServerEvent = new ServerEvent().setEventName("Subscribe").setEventTime(currentTime()).setCustomData(fbCustomData).setUserData(fbUserData);
        const fbEventRequest = new EventRequest(pixel.accessToken, pixel.pixelId).setEvents([fbServerEvent]);
        const result = await fbEventRequest.execute();
        logger.info(`SubscriptionService.sendFacebookEvent, result:${JSON.stringify(result)}`);
    }

    private async sendTikTokEvent(pixel: PixelSelect, subscriptionInfo: SubscriptionSelect) {
        const [productInfo] = await productDao.getProductListInIds([subscriptionInfo.productId]);

        const data = {
            accessToken: pixel.accessToken,
            pixelCode: pixel.pixelId,
            event: TikTokEvent.Subscribe,
            eventId: subscriptionInfo.subscriptionNo,
            externalId: subscriptionInfo.userId.toString(),
            url: productInfo.host || '',
        }
        await tikTokBusinessProxy.sendEvent(data);
    }

    private async processSubscriptionPayment(req: PayermaxNotificationReq<PayermaxSubscriptionNotificationData>) {
        const subscriptionNo = req.data.subscriptionPlan.subscriptionNo;
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(subscriptionNo);
        logger.info(`SubscriptionService.processSubscriptionPayment, subscriptionNo:${subscriptionNo}`);

        const orderPaymentId = req.data.subscriptionPaymentDetail.lastPaymentInfo.tradeToken;
        const targetStatus = PayermaxResultToStatus[req.data.subscriptionPaymentDetail.paymentStatus];

        let orderInfo = await orderDao.getOrderByPaymentIdAndChannel(orderPaymentId, PaymentChannel.Payermax);
        if (!orderInfo) {
            const orderBizId = await orderBizIdGenerator.generate();
            const orderId = await orderDao.addOrder({
                bizId: orderBizId,
                userId: subscriptionInfo.userId,
                amount: req.data.subscriptionPaymentDetail.payAmount.amount,
                currency: req.data.subscriptionPaymentDetail.payAmount.currency,
                skuId: subscriptionInfo.skuId,
                productId: subscriptionInfo.productId,
                paymentId: orderPaymentId,
                subscriptionId: subscriptionInfo.id,
                subscriptionCount: req.data.subscriptionPaymentDetail.subscriptionIndex + 1,
                paymentChannel: PaymentChannel.Payermax,
                paymentType: req.data.subscriptionPaymentDetail.paymentMethodType,
                orderStatus: targetStatus
            });
            orderInfo = await orderDao.getOrderById(orderId);
            logger.info(`SubscriptionService.processSubscriptionPayment, newOrderInfo: ${JSON.stringify(orderInfo)}`);
        } else {
            logger.info(`SubscriptionService.processSubscriptionPayment, updatesubscriptionCount: ${req.data.subscriptionPaymentDetail.subscriptionIndex + 1}`);
            await orderDao.updateOrderById(orderInfo.id, { subscriptionCount: req.data.subscriptionPaymentDetail.subscriptionIndex + 1 });
        }

        if (!OrderFinalState.includes(orderInfo.orderStatus)) {
            orderStatusHelper.processChangeOrderStatus(orderInfo, targetStatus);
        }
    }
}

export const subscriptionService = new SubscriptionService();
