import { orderCreateReqSchema } from "@lib/common/dto/order";
import { validated } from "@lib/middleware/validated";
import { Hono } from "hono";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { orderPlacementService } from "../services/order/order-placement.service";

const order = new Hono();

order.post('/create', validated('json', orderCreateReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const host = c.req.header('host') as string;

    const req = c.req.valid('json');
    const resp = await orderPlacementService.create(host, user, req);
    return c.json(success(resp));
});

export default order;
