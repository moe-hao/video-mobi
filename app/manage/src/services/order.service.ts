import { PaymentType, PaymentTypeName } from "@lib/common/consts/payment";
import type { OrderListReq, OrderListResp } from "@lib/common/dto/order";
import { orderDao } from "@lib/repo/dao/order.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import { OrderStatus, OrderStatusName } from "@lib/common/consts/order";
import { formatUnixTime } from "@lib/common/utils/time";
import { productDao } from "@lib/repo/dao/product.dao";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { exchangeProxy } from "@lib/repo/proxy/exchange/exchange";
import type { SkuType } from "@lib/common/consts/sku";

class OrderService {
    async getOrderList(req: OrderListReq): Promise<OrderListResp> {
        const search = {
            search: req.search,
            userId: req.userId,
            status: req.status ?? '' as OrderStatus | '',
            productId: req.productId ?? '',
            startDate: req.startDate,
            endDate: req.endDate,
            orderType: req.orderType ?? '',
            subscriptionCount: req.subscriptionCount ?? '',
            collectionBizId: req.collectionBizId ?? '',
        };

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

        const collectionBizIds: string[] = [];
        const exchangeRateMap = new Map<string, number>();
        const orderIdToPlatfrom = new Map<number, string>();
        for (const item of orderList) {
            if (item.collectionBizId) {
                collectionBizIds.push(item.collectionBizId);
            }

            const ad = JSON.parse(item.ad || '{}');

            if (ad.fbclid) {
                orderIdToPlatfrom.set(item.id, 'Facebook');
            }

            if (ad.ttclid) {
                orderIdToPlatfrom.set(item.id, 'TikTok');
            }

            if (!exchangeRateMap.has(item.currency)) {
                if (item.currency) {
                    exchangeRateMap.set(item.currency, await exchangeProxy.getExchangeRate(item.currency, 'USD'));
                }
            }
        }

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
                platfrom: orderIdToPlatfrom.get(item.id) || '',
                userId: item.userId,
                username: userIdToInfoMap.get(item.userId)?.username || '',
                email: userIdToInfoMap.get(item.userId)?.email || '',
                amount: item.amount,
                currency: item.currency,
                dollar: (Number(item.amount) * (exchangeRateMap.get(item.currency) || 0)).toFixed(2),
                orderType: item.orderType as SkuType,
                subscriptionId: item.subscriptionId,
                subscriptionCount: item.subscriptionCount,
                paymentChennel: item.paymentChannel,
                paymentType: item.paymentType as PaymentType,
                paymentTypeName: PaymentTypeName[item.paymentType as PaymentType],
                orderStatus: item.orderStatus as OrderStatus,
                orderStatusName: OrderStatusName[item.orderStatus as OrderStatus],
                collectionBizId: item.collectionBizId,
                collectionName: collectionBizIdToInfoMap.get(item.collectionBizId)?.name || '',
                collectionSourceName: collectionBizIdToInfoMap.get(item.collectionBizId)?.sourceName || '',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }
}

export const orderService = new OrderService();
