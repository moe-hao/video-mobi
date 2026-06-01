import { Hono } from "hono";
import { orderService } from "../services/order.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { orderListReqSchema } from "@lib/common/dto/order";

const order = new Hono();

order.get('/list', validated('query', orderListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await orderService.getOrderList(req)
    return c.json(success(resp))
});

export default order;
