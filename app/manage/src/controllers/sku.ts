import { Hono } from "hono";
import { success } from "@lib/common/dto/result";
import { skuService } from "../services/sku.service";
import { SkuAddReqSchema, SkuDeleteReqSchema, SkuEditReqSchema, SkuManageListReqSchema } from "@lib/common/dto/sku.schema";
import { validated } from "@lib/middleware/validated";
import { DeleteStatus } from "@lib/common/consts/common-status";

const sku = new Hono();

sku.get('/list', validated('query', SkuManageListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await skuService.getSkuList(req);
    return c.json(success(resp));
});

sku.post('/add', validated('json', SkuAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await skuService.addSku(req);
    return c.json(success());
});

sku.post('/edit', validated('json', SkuEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await skuService.updateSku(req);
    return c.json(success());
});

sku.post('/delete', validated('json', SkuDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await skuService.updateSkuDeleteStatus(req.id, DeleteStatus.Deleted);
    return c.json(success());
});

export default sku;
