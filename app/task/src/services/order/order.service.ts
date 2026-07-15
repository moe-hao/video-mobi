import { orderDao } from "@lib/repo/dao/order.dao"

export const orderService = {
    asyncOrderCollectionBizIdFromAd: async () => {
        const pageSize = 100;
        let page = 1;
        const emptySearch = {
            search: '',
            userId: '',
            status: '',
            productId: '',
            startDate: '',
            endDate: '',
            orderType: '',
            subscriptionCount: '',
        };

        while (true) {
            const orders = await orderDao.getOrderListPage(page, pageSize, emptySearch);
            if (orders.length === 0) break;

            for (const order of orders) {
                const collectionBizId = (() => { try { return JSON.parse(order.ad || "{}").collectionId || ""; } catch { return ""; } })();
                if (collectionBizId === '') continue;
                await orderDao.updateOrderById(order.id, { collectionBizId });
            }

            if (orders.length < pageSize) break;
            page++;
        }
    }
}
