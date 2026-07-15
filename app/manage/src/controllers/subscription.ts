import { Hono } from "hono";
import { subscriptionService } from "../services/subscription.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { subscriptionListReqSchema } from "@lib/common/dto/subscription";

const subscription = new Hono();

subscription.get('/list', validated('query', subscriptionListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await subscriptionService.getSubscriptionList(req);
    return c.json(success(resp));
});

export default subscription;
