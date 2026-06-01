import { PaymentType, PaymentTypeName } from "@lib/common/consts/payment";
import type { OrderListReq, OrderListResp } from "@lib/common/dto/order";
import { orderDao } from "@lib/repo/dao/order.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import { OrderStatus, OrderStatusName } from "@lib/common/consts/order";
import { formatUnixTime } from "@lib/common/utils/time";

class OrderService {
    async getOrderList(req: OrderListReq): Promise<OrderListResp> {
        const [orderList, orderTotal] = await Promise.all([
            orderDao.getOrderListPage(req.page, req.size),
            orderDao.getOrderListTotal()
        ]);

        const orderUserIds = orderList.map((item) => item.userId);
        const userList = await userDao.getUserListByIds(orderUserIds);
        const userIdToInfoMap = new Map(userList.map((item) => [item.id, item]));

        return {
            page: req.page,
            size: req.size,
            total: orderTotal,
            list: orderList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                userId: item.userId,
                username: userIdToInfoMap.get(item.userId)?.username || '',
                email: userIdToInfoMap.get(item.userId)?.email || '',
                amount: item.amount,
                currency: item.currency,
                subscriptionId: item.subscriptionId,
                subscriptionCount: item.subscriptionCount,
                paymentChennel: item.paymentChannel,
                paymentType: item.paymentType,
                paymentTypeName: PaymentTypeName[item.paymentType as PaymentType],
                orderStatus: item.orderStatus,
                orderStatusName: OrderStatusName[item.orderStatus as OrderStatus],
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }
}

export const orderService = new OrderService();
