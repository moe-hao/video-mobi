import { Hono } from "hono";
import { paymentOptionService } from "../services/payment-option.service";
import { validated } from "@lib/middleware/validated";
import { paymentOptionListReqSchema, paymentOptionAddReqSchema, paymentOptionEditReqSchema, paymentOptionDeleteReqSchema, paymentOptionItemsReqSchema } from "@lib/common/dto/payment-option";
import { success } from "@lib/common/dto/result";

const paymentOption = new Hono();

paymentOption.get('/list', validated('query', paymentOptionListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await paymentOptionService.getPaymentOptionList(req);
    return c.json(success(resp));
});

paymentOption.post('/add', validated('json', paymentOptionAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await paymentOptionService.addPaymentOption(req);
    return c.json(success());
});

paymentOption.post('/edit', validated('json', paymentOptionEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await paymentOptionService.editPaymentOption(req);
    return c.json(success());
});

paymentOption.post('/delete', validated('json', paymentOptionDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await paymentOptionService.deletePaymentOption(req);
    return c.json(success());
});

paymentOption.get('/items', validated('query', paymentOptionItemsReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await paymentOptionService.getPaymentOptionItems(req);
    return c.json(success(resp));
});

paymentOption.get('/normal_option_list', async (c) => {
    const resp = await paymentOptionService.getNormalPaymentOptionList();
    return c.json(success(resp));
});

export default paymentOption;
