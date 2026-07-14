import { Hono } from "hono";
import { paypalEventService } from "../services/paypal/paypal-event.service";
import type { PaypalEventReq } from "@lib/common/dto/paypal";
import { success } from "@lib/common/dto/result";
import { paypalSignature } from "../services/paypal/paypal-signature.service";

const paypal = new Hono();
paypal.use(paypalSignature);

paypal.post('/event', async (c) => {
    const req = await c.req.json() as PaypalEventReq;
    await paypalEventService.handleEvent(req);
    return c.json(success());
});

export default paypal;
