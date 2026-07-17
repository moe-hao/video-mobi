import { createMiddleware } from "hono/factory";
import { authInfoService } from "../services/auth/auth-info.service";
import { logger } from "@lib/internal/logger";

export const userAuthInfoMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path === '/api/mobi/auth/guest_login') {
        await next();
        return;
    }


    logger.info(`CF-IPCountry: ${c.req.header('CF-IPCountry')}`);
    const headers = c.req.header();
    for (const [key, value] of Object.entries(headers)) {
        const headerKey = key.toLowerCase();
        if (headerKey === 'authorization') {
            const { userAuthInfo, authToken } = await authInfoService.getAuthInfo(value);
            c.set('user', userAuthInfo);
            c.set('authToken', authToken);
            break;
        }
    }
    await next();
})
