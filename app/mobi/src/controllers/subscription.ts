import { Hono } from "hono";
import { subscriptionService } from "../services/subscription/subscription.service";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";

const subscription = new Hono();

subscription.get('/detail', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const resp = await subscriptionService.getSubscriptionDetail(user);
    return c.json(success(resp));
});

subscription.post('/cancel', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const resp = await subscriptionService.cancel(user);
    return c.json(success(resp));
});

export default subscription;
