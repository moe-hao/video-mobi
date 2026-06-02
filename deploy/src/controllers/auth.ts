import { Hono } from "hono";
import { guestLoginReqSchema } from "@lib/common/dto/guest";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { sendEmailCodeReqSchema, verifyEmailCodeReqSchema } from "@lib/common/dto/email";
import config from "@lib/internal/config";
import { guestLoginService } from "../services/auth/guest-login.service";
import { authEmailLoginService } from "../services/auth/email-login.service";
import { encrypt } from "@lib/common/utils/aes-encrypt";
import type { UserAuthInfo } from "@lib/repo/redis/user";

const auth = new Hono();

auth.post('/guest_login', validated('json', guestLoginReqSchema), async (c) => {
    const param = c.req.valid('json');
    const resp = await guestLoginService.login(param);
    return c.json(success(resp));
});

auth.post('/send_email_code', validated('json', sendEmailCodeReqSchema), async (c) => {
    const param = c.req.valid('json');
    const code = await authEmailLoginService.sendCode(param);
    return c.json(success({ verifyCode: code }));
});

auth.post('/verify_email_code', validated('json', verifyEmailCodeReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('json');
    const resp = await authEmailLoginService.verifyCode(req, user);
    return c.json(success(resp));
});

auth.get('/info', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const authToken = await c.get('authToken' as never) as string;

    const resp = {
        bizId: user?.bizId || '',
        username: user?.username || '',
        email: user?.email || '',
        isLogin: user !== undefined,
        guestCode: encrypt(authToken, config.EncryptVector),
        userType: user.userType,
    }
    return c.json(success(resp));
});

auth.get('/logout', async (c) => {
    return c.json(success());
})

export default auth;
