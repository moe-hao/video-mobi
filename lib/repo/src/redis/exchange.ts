import { CommonRedisKeyPrefix } from "@lib/common/consts/redis";
import { redis, type RedisConn } from "@lib/internal/redis";


class ExchangeRedis {
    private readonly redis: RedisConn = redis;
    private readonly expireTime = 24 * 60 * 60;

    async getExchangeRate(base: string, target: string): Promise<number> {
        const key = `${CommonRedisKeyPrefix.ExchangeRate}:${base}:${target}`;
        const rate = await this.redis.get(key) || 0;
        return Number(rate);
    }

    async setExchangeRate(base: string, target: string, rate: number) {
        const key = `${CommonRedisKeyPrefix.ExchangeRate}:${base}:${target}`;
        await this.redis.setex(key, this.expireTime, rate);
    }
}

export const exchangeRedis = new ExchangeRedis();
