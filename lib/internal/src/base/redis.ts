import Redis from "ioredis";
import { config } from "./config";
import { logger } from "./logger";

export const redis = new Redis({
    host: config.RedisHost,
    port: config.RedisPort,
});

redis.on('connect', () => {
    logger.info('Redis connected: Success!');
});

export type RedisConn = typeof redis;
