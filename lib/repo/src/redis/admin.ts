import { redis, type RedisConn } from "@lib/internal/redis";
import { AdminRedisKeyPrefix } from "@lib/common/consts/redis";

export interface AdminAuthInfo {
    id: number;
    username: string;
}

class AdminAuthRedis {
    private readonly redis: RedisConn = redis;
    private readonly authTokenExpire = 24 * 60 * 60;

    async setAuthToken(token: string, authInfo: AdminAuthInfo) {
        const key = `${AdminRedisKeyPrefix.AuthToken}${token}`
        await this.redis.setex(key, this.authTokenExpire, JSON.stringify(authInfo));
    }

    async getAuthToken(token: string): Promise<AdminAuthInfo | undefined> {
        const key = `${AdminRedisKeyPrefix.AuthToken}${token}`
        const authInfo = await this.redis.get(key);
        if (authInfo) {
            return JSON.parse(authInfo);
        }
        return undefined;
    }

    async delAuthToken(token: string) {
        const key = `${AdminRedisKeyPrefix.AuthToken}${token}`
        await this.redis.del(key);
    }
}

export const adminAuthRedis = new AdminAuthRedis();
