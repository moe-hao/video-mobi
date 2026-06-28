import type { OrderPayermaxResultResp, PayermaxNotificationReq, PayermaxSubscriptionNotificationData } from "@lib/common/dto/payermax";
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
import crypto from "crypto";
import { currentTime } from "@lib/common/utils/time";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import type { PixelSelect } from "@lib/repo/models/pixel";
import { PixelPlatform, PixelEvent } from "@lib/common/consts/pixel";
import { tikTokBusinessProxy } from "@lib/repo/proxy/tiktok/business";
import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import { facebookProxy } from "@lib/repo/proxy/facebook/facebook";
import type { AdParam } from "@lib/repo/proxy/facebook/facebook.interface";
import config from "@lib/internal/config";

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
        logger.info(`SubscriptionService.processSubscriptionStatus, req:${JSON.stringify(req)}`);
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
                                await this.sendFacebookEvent(pixel, subscriptionInfo);
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

    async sendFacebookEvent(pixel: PixelSelect, subscriptionInfo: SubscriptionSelect) {
        const [orderInfo] = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);
        const adParam = JSON.parse(orderInfo.ad || '{}') as AdParam;

        const fbUserAppId = crypto.createHash("sha256").update(subscriptionInfo.userId.toString()).digest("hex")
        const req = {
            access_token: pixel.accessToken,
            data: [{
                event_name: PixelEvent.Purchase,
                event_time: currentTime(),
                attribution_data: {
                    ad_id: adParam.ad_id,
                    adset_id: adParam.adset_id,
                    campaign_id: adParam.campaign_id
                },
                user_data: {
                    app_user_id: fbUserAppId,
                    fbc: `fb.1.${currentTime()}.${adParam.fbclid}`
                },
                custom_data: {
                    value: Number(orderInfo.amount),
                    currency: orderInfo.currency,
                },
                action_source: "website",
            }]
        };
        if (config.AppEnv === 'prod') {
            await facebookProxy.sendEvent(pixel.pixelId, req);
        }
    }

    async sendTikTokEvent(pixel: PixelSelect, subscriptionInfo: SubscriptionSelect) {
        const [productInfo] = await productDao.getProductListInIds([subscriptionInfo.productId]);
        const [orderInfo] = await orderDao.getOrderListByUserIdAndSubscriptionId(subscriptionInfo.userId, subscriptionInfo.id);
        const ttUserId = crypto.createHash("sha256").update(subscriptionInfo.userId.toString()).digest("hex");
        const ad = JSON.parse(orderInfo.ad || '{}');

        const req = {
            event_source: "web",
            event_source_id: pixel.pixelId,
            data: [{
                event: PixelEvent.Purchase,
                event_time: currentTime(),
                event_id: subscriptionInfo.subscriptionNo,
                user: {
                    external_id: ttUserId,
                    ttclid: ad.ttclid || '',
                },
                properties: {
                    content_ids: [subscriptionInfo.skuId.toString()],
                    currency: orderInfo.currency,
                    value: Number(orderInfo.amount),
                },
                page: {
                    url: productInfo.host || '',
                },
                ad: {
                    creative_id: ad.creative_id || '',
                    ad_id: ad.ad_id || '',
                    campaign_id: ad.campaign_id || '',
                }
            }]
        };
        if (config.AppEnv === 'prod') {
            await tikTokBusinessProxy.sendEvent(pixel.accessToken, req);
        }
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
                orderStatus: targetStatus,
                ad: subscriptionInfo.ad || "",
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
