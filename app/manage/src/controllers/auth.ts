import { Hono } from "hono";
import { authService } from "../services/auth.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { adminChangePasswordReqSchema, adminLoginReqSchema, type AdminInfoResp } from "@lib/common/dto/admin";
import type { AdminAuthInfo } from "@lib/repo/redis/admin";

const auth = new Hono();

auth.post('/login', validated('json', adminLoginReqSchema), async (c) => {
    const req = c.req.valid('json');
    const resp = await authService.login(req);
    return c.json(success(resp));
});

auth.post('/logout', async (c) => {
    const token = c.get('token' as never) as string;
    await authService.logout(token);
    return c.json(success());
});

auth.get('/info', (c) => {
    const user = c.get('user' as never) as AdminAuthInfo;
    const resp: AdminInfoResp = {
        username: user.username,
    }
    return c.json(success(resp));
});

auth.post('/change_password', validated('json', adminChangePasswordReqSchema), async (c) => {
    const user = c.get('user' as never) as AdminAuthInfo;
    const req = c.req.valid('json');
    await authService.changeAuthPassword(user, req);
    return c.json(success());
});

export default auth;
