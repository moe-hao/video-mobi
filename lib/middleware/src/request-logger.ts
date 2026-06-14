import { logger } from "@lib/internal/logger";
import { createMiddleware } from "hono/factory";

export const requestLogger = createMiddleware(async (c, next) => {
    logger.info(`Reqest URL:${c.req.url}`);
    const startTime = Date.now();
    await next();
    const endTime = Date.now();

    logger.info(`Response URL:${c.req.url}; Path:${c.req.path}; Method:${c.req.method}; Status:${c.res.status}; Cost:${endTime - startTime}ms`);
})
