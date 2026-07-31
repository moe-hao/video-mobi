import type { AntomPaymentNotificationReq } from "@lib/common/dto/antom";
import { AntomResultStatus, type INotifyTypeOperation } from "./notify-type-operation";
import { orderDao } from "@lib/repo/dao/order.dao";
import { OrderStatus } from "@lib/common/consts/order";
import { MemberDeliveryFactory } from "@app/order/member";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { PixelPlatform } from "@lib/common/consts/pixel";
import { subscriptionService } from "../../payermax/subscription-service";

export class CaptureResultOperation implements INotifyTypeOperation {
    constructor(private readonly content: AntomPaymentNotificationReq) { }

    async do(): Promise<void> {
        const orderBizId = this.content.captureRequestId;
        const orderInfo = await orderDao.getOrderByBizId(orderBizId);
        if (orderInfo && this.content.result?.resultStatus === AntomResultStatus.Success) {
            await orderDao.updateOrderById(orderInfo.id, {
                paymentId: this.content.paymentId,
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

        if (this.content.subscriptionRequestId && this.content.subscriptionId && this.content.result?.resultStatus === AntomResultStatus.Failed) {
            await orderDao.updateOrderById(orderInfo.id, {
                paymentId: this.content.paymentId,
                orderStatus: OrderStatus.Failed,
            });

        }
    }
}
