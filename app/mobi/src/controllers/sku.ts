import { Hono } from "hono";
import { skuService } from "../services/sku.service";
import { success } from "@lib/common/dto/result";

const sku = new Hono();

sku.get('/sku_list', async (c) => {
    const host = c.req.header("host") || '';
    const skuList = await skuService.getProductSkuList(host);
    return c.json(success(skuList));
});

export default sku;
