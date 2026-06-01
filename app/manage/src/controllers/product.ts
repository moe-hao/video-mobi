import { Hono } from "hono";
import { productService } from "../services/product.service";
import { success } from "@lib/common/dto/result";

const product = new Hono();

product.get('/list', async (c) => {
    const productList = await productService.getProductList();
    return c.json(success(productList));
})

export default product;

