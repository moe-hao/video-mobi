import { Hono } from "hono";
import type { PayssionWebhookReq, PayssionWebhookPaymentData } from "@lib/common/dto/payssion";
import { payssionWebhookService } from "../services/payssion/webhook.service";
import { createMiddleware } from "hono/factory";
import { createHmac } from "crypto";
import config from "@lib/internal/config";

const payssionVerifySign = createMiddleware(async (c, next) => {
    const body = await c.req.text();
    const originalSign = c.req.header('Payssion-Signature') as string;
    const signingSecret = config.PayssionWebhookSecret;
    const computedSign = createHmac('sha256', signingSecret).update(body).digest('hex');

    if (computedSign !== originalSign) {
        return c.json({ error: 'sign verify failed' }, 400);
    }
    return await next();
})

const payssion = new Hono();

payssion.post('/webhook', payssionVerifySign, async (c) => {
    const req = await c.req.json<PayssionWebhookReq<PayssionWebhookPaymentData>>();
    await payssionWebhookService.handle(req);
    return c.json({
        code: 0,
        msg: 'success',
    });
});

export default payssion;
