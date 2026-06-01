import { orderRedis } from "@lib/repo/redis/order";

class OrderBizIdGenerator {
    async generate(): Promise<string> {
        const incrId = await orderRedis.getOrderIncrId();
        const currentTime = new Date().toISOString().replace(/[-T:.]/g, '').slice(2, 14);
        const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

        return `${currentTime}00${String(incrId % 10000).padStart(4, '0')}${random}`;
    }
}

export const orderBizIdGenerator = new OrderBizIdGenerator();
