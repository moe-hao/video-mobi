import { Hono } from "hono";
import type { PayssionWebhookReq, PayssionWebhookPaymentData } from "@lib/common/dto/payssion";
import { payssionWebhookService } from "../services/payssion/webhook.service";

const payssion = new Hono();

payssion.post('/webhook', async (c) => {
    const req = await c.req.json<PayssionWebhookReq<PayssionWebhookPaymentData>>();
    await payssionWebhookService.handle(req);
    return c.json({
        code: 0,
        msg: 'success',
    });
});

export default payssion;
