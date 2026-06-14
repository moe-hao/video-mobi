import { Hono } from "hono";
import { success } from "@lib/common/dto/result";
import { skuService } from "../services/sku.service";
import { skuAddReqSchema, skuDeleteReqSchema, skuEditReqSchema, skuManageListReqSchema } from "@lib/common/dto/sku";
import { validated } from "@lib/middleware/validated";
import { DeleteStatus } from "@lib/common/consts/common-status";

const sku = new Hono();

sku.get('/list', validated('query', skuManageListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await skuService.getSkuList(req);
    return c.json(success(resp));
});

sku.post('/add', validated('json', skuAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await skuService.addSku(req);
    return c.json(success());
});

sku.post('/edit', validated('json', skuEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await skuService.updateSku(req);
    return c.json(success());
});

sku.post('/delete', validated('json', skuDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await skuService.updateSkuDeleteStatus(req.id, DeleteStatus.Deleted);
    return c.json(success());
});

export default sku;
