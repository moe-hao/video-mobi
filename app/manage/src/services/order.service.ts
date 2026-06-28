import { PaymentType, PaymentTypeName } from "@lib/common/consts/payment";
import type { OrderListReq, OrderListResp } from "@lib/common/dto/order";
import { orderDao } from "@lib/repo/dao/order.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import { OrderStatus, OrderStatusName } from "@lib/common/consts/order";
import { formatUnixTime } from "@lib/common/utils/time";
import { productDao } from "@lib/repo/dao/product.dao";
import { collectionDao } from "@lib/repo/dao/collection.dao";

class OrderService {
    async getOrderList(req: OrderListReq): Promise<OrderListResp> {
        const search = {
            search: req.search,
            status: req.status ?? '' as OrderStatus | '',
        }

        const [orderList, orderTotal] = await Promise.all([
            orderDao.getOrderListPage(req.page, req.size, search),
            orderDao.getOrderListTotal(search)
        ]);

        const orderUserIds = orderList.map((item) => item.userId);
        const userList = await userDao.getUserListByIds(orderUserIds);
        const userIdToInfoMap = new Map(userList.map((item) => [item.id, item]));

        const productIds = orderList.map((item) => item.productId);
        const productList = await productDao.getProductListInIds(productIds);
        const productIdToInfoMap = new Map(productList.map((item) => [item.id, item]));

        const collectionBizIds = orderList.map((item) => JSON.parse(item.ad || '{}').collectionId || '').filter(item => item !== '');
        const collectionList = await collectionDao.getCollectionInBizIds(collectionBizIds);
        const collectionBizIdToInfoMap = new Map(collectionList.map((item) => [item.bizId, item]));

        return {
            page: req.page,
            size: req.size,
            total: orderTotal,
            list: orderList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                host: productIdToInfoMap.get(item.productId)?.host || '',
                userId: item.userId,
                username: userIdToInfoMap.get(item.userId)?.username || '',
                email: userIdToInfoMap.get(item.userId)?.email || '',
                amount: item.amount,
                currency: item.currency,
                subscriptionId: item.subscriptionId,
                subscriptionCount: item.subscriptionCount,
                paymentChennel: item.paymentChannel,
                paymentType: item.paymentType as PaymentType,
                paymentTypeName: PaymentTypeName[item.paymentType as PaymentType],
                orderStatus: item.orderStatus as OrderStatus,
                orderStatusName: OrderStatusName[item.orderStatus as OrderStatus],
                collectionBizId: JSON.parse(item.ad || '{}').collectionId || '',
                collectionName: collectionBizIdToInfoMap.get(JSON.parse(item.ad || '{}').collectionId || '')?.name || '',
                collectionSourceName: collectionBizIdToInfoMap.get(JSON.parse(item.ad || '{}').collectionId || '')?.sourceName || '',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }
}

export const orderService = new OrderService();
