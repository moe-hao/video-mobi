import { Redis } from "ioredis";
import { config } from "./config.ts";
import { logger } from "./logger.ts";

export const redis = new Redis({
    host: config.RedisHost,
    port: config.RedisPort,
});

redis.on('connect', () => {
    logger.info('Redis connected: Success!');
});


export type RedisConn = typeof redis;
