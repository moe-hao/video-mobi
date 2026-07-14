import { OrderStatus } from "@lib/common/consts/order";
import type { OrderSelect } from "@lib/repo/models/order";
import { orderDao } from "@lib/repo/dao/order.dao";
import { subscriptionService } from "../subscription-service";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { MemberDeliveryFactory } from "@app/order/member";
import { SkuType } from "@lib/common/consts/sku";
import { PixelPlatform } from "@lib/common/consts/pixel";

class OrderStatusHelper {
    async processChangeOrderStatus(orderInfo: OrderSelect, targetStatus: OrderStatus) {
        switch (targetStatus) {
            case OrderStatus.Pending:
                this.processPendingShouldOrderStatus(orderInfo.id, orderInfo.orderStatus, targetStatus);
                break;
            case OrderStatus.Paid:
                this.processPaidShouldOrderStatus(orderInfo.id, orderInfo.orderStatus, targetStatus);
                await MemberDeliveryFactory.create(orderInfo).deliver();
                await orderDao.updateOrderById(orderInfo.id, { orderStatus: OrderStatus.Completed });

                if (orderInfo.orderType === SkuType.Coin) {
                    const pixelInfo = await pixelDao.getPixelById(orderInfo.pixelId);

                    if (pixelInfo.platfrom === PixelPlatform.Facebook) {
                        await subscriptionService.sendFacebookEventCoin(pixelInfo, orderInfo);
                    }

                    if (pixelInfo.platfrom === PixelPlatform.TikTok) {
                        await subscriptionService.sendTikTokEventCoin(pixelInfo, orderInfo);
                    }
                }

                break;
            default:
                await orderDao.updateOrderById(orderInfo.id, { orderStatus: targetStatus });
        }
    }

    private processPendingShouldOrderStatus(orderId: number, currentStatus: OrderStatus, targetStatus: OrderStatus) {
        if (currentStatus === OrderStatus.Created) {
            orderDao.updateOrderById(orderId, { orderStatus: targetStatus });
        }
    }

    private processPaidShouldOrderStatus(orderId: number, currentStatus: OrderStatus, targetStatus: OrderStatus) {
        if (currentStatus === OrderStatus.Created || currentStatus === OrderStatus.Pending) {
            orderDao.updateOrderById(orderId, { orderStatus: targetStatus });
        }
    }
}

export const orderStatusHelper = new OrderStatusHelper();
