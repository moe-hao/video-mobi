import { Hono } from "hono";
import { getProductSkuList, getProductSkuRetrieveInfo } from "../services/sku.service";
import { success } from "@lib/common/dto/result";

const sku = new Hono();

sku.get('/sku_list', async (c) => {
    const host = c.req.header("host") || '';
    const region = c.req.header("CF-IPCountry") || '';
    const skuList = await getProductSkuList(host, region);
    return c.json(success(skuList));
});

sku.get('/retrieve_info', async (c) => {
    const host = c.req.header("host") || '';
    const region = c.req.header("CF-IPCountry") || '';
    const retrieveInfo = await getProductSkuRetrieveInfo(host, region);
    return c.json(success(retrieveInfo));
});

export default sku;
