import { Hono } from "hono";
import { productService } from "../services/product.service";
import { success } from "@lib/common/dto/result";
import { validated } from "@lib/middleware/validated";
import { productAddReqSchema, productEditReqSchema, productListReqSchema } from "@lib/common/dto/product";

const product = new Hono();

product.get('/list', validated('query', productListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const productList = await productService.getProductList(req);
    return c.json(success(productList));
});

product.post('/edit', validated('json', productEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await productService.editProduct(req);
    return c.json(success());
});

product.post('/add', validated('json', productAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await productService.addProduct(req);
    return c.json(success());
});

product.get('/all', async (c) => {
    const productList = await productService.getAllProductList();
    return c.json(success(productList));
});

export default product;

