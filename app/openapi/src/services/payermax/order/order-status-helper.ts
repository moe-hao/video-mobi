import { OrderStatus } from "@lib/common/consts/order";
import type { OrderSelect } from "@lib/repo/models/order";
import { memberDelivery } from "@app/order/member";
import { orderDao } from "@lib/repo/dao/order.dao";

class OrderStatusHelper {
    async processChangeOrderStatus(orderInfo: OrderSelect, targetStatus: OrderStatus) {
        switch (targetStatus) {
            case OrderStatus.Pending:
                this.processPendingShouldOrderStatus(orderInfo.id, orderInfo.orderStatus, targetStatus);
                break;
            case OrderStatus.Paid:
                this.processPaidShouldOrderStatus(orderInfo.id, orderInfo.orderStatus, targetStatus);
                await memberDelivery.deliver(orderInfo);
                await orderDao.updateOrderById(orderInfo.id, { orderStatus: OrderStatus.Completed });
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
