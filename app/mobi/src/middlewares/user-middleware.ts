import { createMiddleware } from "hono/factory";
import { authInfoService } from "../services/auth/auth-info.service";
import { logger } from "@lib/internal/base/logger";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";

export const userAuthInfoMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path === '/api/auth/guest_login') {
        await next();
        return;
    }

    logger.info(`CF-IPCountry: ${c.req.header('CF-IPCountry')}`);
    const authorization = c.req.header('Authorization');
    if (!authorization) {
        throw new InternalException(ResultCode.AuthFailed);
    }

    const { userAuthInfo, authToken } = await authInfoService.getAuthInfo(authorization);
    if (!userAuthInfo || !authToken) {
        throw new InternalException(ResultCode.AuthFailed);
    }

    c.set('user' as never, userAuthInfo);
    c.set('authToken' as never, authToken);
    await next();
})
