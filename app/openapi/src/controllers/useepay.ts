import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { Hono } from "hono";
import { handleWebhookEvent } from "../services/useepay/webhook.service";
import { logger } from "@lib/internal/logger";
import { verifyUseePaySign } from "../services/useepay/sign";
import { createMiddleware } from "hono/factory";

const sign = createMiddleware(async (c, next) => {
    const body = await c.req.text();
    const sign = c.req.header('sign') as string;

    logger.info("useepay webhook sign: %s; body: %s", sign, body);
    if (verifyUseePaySign(sign, body)) {
        logger.info("useepay webhook sign verify success");
        return await next();
    } else {
        logger.error("useepay webhook sign verify failed");
        return c.json({ error: 'sign verify failed' }, 400);
    }
});

const useepay = new Hono();
useepay.use(sign);

useepay.post("/webhook", async (c) => {
    const req = await c.req.json() as UseePayWebhookEvent;
    logger.info(`useepay webhook event: ${JSON.stringify(req)}`);
    handleWebhookEvent(req);
});

export default useepay;
