import { CommonRedisKeyPrefix } from "@lib/common/consts/redis";
import { redis, type RedisConn } from "@lib/internal/redis";

class AuthVerifyRedis {
    private readonly redis: RedisConn = redis;
    private readonly verifyCodeExpireTime = 15 * 60;

    async setAuthVerifyCode(email: string, code: string) {
        await this.redis.setex(`${CommonRedisKeyPrefix.VerifyCode}:${email}`, this.verifyCodeExpireTime, code);
    }

    async getAuthVerifyCode(email: string): Promise<string> {
        return await this.redis.get(`${CommonRedisKeyPrefix.VerifyCode}:${email}`) || '';
    }
}

export const authVerifyRedis = new AuthVerifyRedis();
