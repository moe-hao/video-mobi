import { Hono } from "hono";
import { getDisputeOrderInfo, getOrderList } from "../services/order.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { orderListReqSchema, disputeOrderReqSchema } from "@lib/common/dto/order";

const order = new Hono();

order.get('/list', validated('query', orderListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await getOrderList(req)
    return c.json(success(resp))
});

order.get('/dispute_order', validated('query', disputeOrderReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await getDisputeOrderInfo(req)
    return c.json(success(resp))
});

export default order;
