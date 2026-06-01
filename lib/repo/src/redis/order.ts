import { CommonRedisKeyPrefix } from "@lib/common/consts/redis";
import { redis, type RedisConn } from "@lib/internal/redis";


class OrderRedis {
    private readonly redis: RedisConn = redis;
    private readonly orderBizIdExpireTime = 24 * 60 * 60;

    async getOrderIncrId(): Promise<number> {
        const nowTime = new Date().toISOString();
        const date = nowTime.slice(2, 10).replace(/-/g, '');
        const key = `${CommonRedisKeyPrefix.OrderBizId}:${date}`;

        const count = await this.redis.incr(key);
        if (count === 1) {
            await this.redis.expire(key, this.orderBizIdExpireTime);
        }
        return count;
    }
}

export const orderRedis = new OrderRedis();
