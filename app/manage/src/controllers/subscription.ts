import { Hono } from "hono";
import { subscriptionService } from "../services/subscription.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { SubscriptionCancelReqSchema, SubscriptionListReqSchema } from "@lib/common/dto/subscription.schema";

const subscription = new Hono();

subscription.get('/list', validated('query', SubscriptionListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await subscriptionService.getSubscriptionList(req);
    return c.json(success(resp));
});

subscription.post('/cancel', validated('json', SubscriptionCancelReqSchema), async (c) => {
    const req = c.req.valid('json');
    await subscriptionService.cancel(req);
    return c.json(success());
});

export default subscription;
