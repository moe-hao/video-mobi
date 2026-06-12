import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { verifyPayermaxSign } from "@lib/common/utils/payermax";
import type { PayermaxNotificationReq, PayermaxPaymentNotificationData, PayermaxSubscriptionNotificationData } from "@lib/common/dto/payermax";
import { payermaxService } from "../services/payermax/payment-service";
import { subscriptionService } from "../services/payermax/subscription-service";
import { logger } from "@lib/internal/logger";

const payermaxVerifySign = createMiddleware(async (c, next) => {
    const body = await c.req.text();
    const sign = c.req.header('sign') as string;

    if (verifyPayermaxSign(body, sign)) {
        logger.info('payermax sign verify success');
        return await next();
    } else {
        return c.json({ error: 'sign verify failed' }, 400);
    }
})

const payermax = new Hono();
payermax.use(payermaxVerifySign);

payermax.post('/payment_notification', async (c) => {
    const req = await c.req.json<PayermaxNotificationReq<PayermaxPaymentNotificationData>>();
    const resp = await payermaxService.receive(req);
    return c.json(resp);
});

payermax.post('/subscription_notification', async (c) => {
    const req = await c.req.json<PayermaxNotificationReq<PayermaxSubscriptionNotificationData>>();
    const resp = await subscriptionService.receive(req);
    return c.json(resp);
});

export default payermax;
