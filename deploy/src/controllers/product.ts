import { Hono } from "hono";
import { productService } from "../services/product.service";
import { logger } from "@lib/internal/logger";
import { success } from "@lib/common/dto/result";

const product = new Hono();

product.get('/info', async (c) => {
    logger.info(`Get product info, host: ${c.req.header("host")}`);

    const host = c.req.header("host") || '';
    const productInfo = await productService.getProductInfo(host);
    return c.json(success(productInfo));
});

export default product;
