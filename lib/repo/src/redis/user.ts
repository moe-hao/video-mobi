import { UserRedisKeyPrefix } from "@lib/common/consts/redis";
import { UserType } from "@lib/common/consts/user";
import { redis, type RedisConn } from "@lib/internal/redis";

export interface UserAuthInfo {
    id: number;
    bizId: string;
    username: string;
    email: string;
    userType: UserType;
}


class UserAuthRedis {
    private readonly redis: RedisConn = redis;
    private readonly authTokenExpire = 24 * 60 * 60;

    async setAuthToken(userId: number, token: string, data: UserAuthInfo): Promise<void> {
        const multi = this.redis.multi();
        multi.setex(`${UserRedisKeyPrefix.AuthToken}:${token}`, this.authTokenExpire, JSON.stringify(data));
        multi.setex(`${UserRedisKeyPrefix.AuthUserToken}:${userId}`, this.authTokenExpire, token);
        await multi.exec();
    }

    async getAuthToken(token: string): Promise<UserAuthInfo | undefined> {
        const result = await this.redis.get(`${UserRedisKeyPrefix.AuthToken}:${token}`);
        return result ? JSON.parse(result as string) as UserAuthInfo : undefined;
    }
}

export const userAuthRedis = new UserAuthRedis();
