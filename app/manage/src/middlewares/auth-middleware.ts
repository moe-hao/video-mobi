import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { createMiddleware } from "hono/factory";
import { authService } from "../services/auth.service";


export const authMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path === '/api/auth/login') {
        await next();
        return;
    }

    const token = c.req.header('Authorization');
    if (!token) {
        throw new InternalException(ResultCode.AuthFailed);
    }

    const authInfo = await authService.getAuthInfoByToken(token);
    c.set('user', authInfo);
    c.set('token', token);
    await next();
})
