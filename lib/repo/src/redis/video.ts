import { CommonRedisKeyPrefix } from "@lib/common/consts/redis";
import { redis, type RedisConn } from "@lib/internal/redis";

class VideoRedis {
    private readonly client: RedisConn = redis;

    async getVideoResourceAuth(): Promise<string> {
        return await this.client.get(CommonRedisKeyPrefix.VideoAuth) || '';
    }

    async setVideoResourceAuth(auth: string) {
        await this.client.setex(CommonRedisKeyPrefix.VideoAuth, 30 * 60, auth);
    }
}

export const videoRedis = new VideoRedis();
