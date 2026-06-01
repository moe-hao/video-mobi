import Redis from "ioredis";
import config from "../config";
import { logger } from "../logger";

export const redis = new Redis({
    host: config.RedisHost,
    port: config.RedisPort,
})

export type RedisConn = typeof redis;

export async function connectRedis() {
    const result = await redis.ping();
    logger.info(`Redis connected: ${result}`);
}
