import { CommonRedisKeyPrefix } from "@lib/common/consts/redis";
import { redis, type RedisConn } from "@lib/internal/redis";

export type VideoResource = { num: number, playUrl: string }

class CollectionVideoResourceRedis {
    private readonly client: RedisConn = redis;

    async getCollectionVideoResourceList(collectionBizId: string): Promise<VideoResource[] | undefined> {
        const result = await this.client.get(`${CommonRedisKeyPrefix.CollectionVideo}:${collectionBizId}`);
        if (result) {
            return JSON.parse(result) as VideoResource[];
        }
        return undefined;
    }

    async setCollectionVideoResourceList(collectionBizId: string, videoResourceList: VideoResource[]) {
        await this.client.setex(`${CommonRedisKeyPrefix.CollectionVideo}:${collectionBizId}`, 30 * 60, JSON.stringify(videoResourceList));
    }
}

export const collectionVideoResourceRedis = new CollectionVideoResourceRedis();
