import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { Hono } from "hono";
import { handleWebhookEvent } from "../services/useepay/webhook.service";

const useepay = new Hono();

useepay.post("/webhook", async (c) => {
    const req = await c.req.json() as UseePayWebhookEvent;
    console.log(JSON.stringify(req));
    handleWebhookEvent(req);
});

export default useepay;
