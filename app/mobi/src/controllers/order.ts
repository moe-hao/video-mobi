import { orderApproveReqSchema, orderCloseReqSchema, orderCreateReqSchema, orderFailedReqSchema } from "@lib/common/dto/order";
import { validated } from "@lib/middleware/validated";
import { Hono } from "hono";
import { orderService } from "../services/order/order.service";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";


const order = new Hono();

order.post('/create', validated('json', orderCreateReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const host = c.req.header('host') as string;

    const req = c.req.valid('json');
    const resp = await orderService.create(host, user, req);
    return c.json(success(resp));
});

order.post('/approve', validated('json', orderApproveReqSchema), async (c) => {
    const req = c.req.valid('json');
    await orderService.approve(req);
    return c.json(success({}));
});

order.post('/close', validated('json', orderCloseReqSchema), async (c) => {
    const req = c.req.valid('json');
    await orderService.close(req);
    return c.json(success({}));
});

order.post('/failed', validated('json', orderFailedReqSchema), async (c) => {
    const req = c.req.valid('json');
    await orderService.failed(req);
    return c.json(success({}));
});

export default order;
