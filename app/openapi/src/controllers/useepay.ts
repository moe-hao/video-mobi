import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { Hono } from "hono";
import { handleWebhookEvent } from "../services/useepay/webhook.service";
import { logger } from "@lib/internal/logger";

const useepay = new Hono();

useepay.post("/webhook", async (c) => {
    const sign = c.req.header('sign') as string;
    logger.info(`useepay webhook sign: ${sign}`);
    const req = await c.req.json() as UseePayWebhookEvent;
    logger.info(`useepay webhook event: ${JSON.stringify(req)}`);
    handleWebhookEvent(req);
});

export default useepay;
