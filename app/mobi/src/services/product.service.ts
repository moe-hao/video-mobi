import type { Language, Region } from "@lib/common/consts/region";
import type { ProductInfoResp } from "@lib/common/dto/product";
import { productDao } from "@lib/repo/dao/product.dao";

class ProductService {
    async getProductInfo(host: string): Promise<ProductInfoResp> {
        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new Error('Product not found');
        }
        return {
            region: productInfo.region as Region,
            language: productInfo.language as Language,
            currency: productInfo.currency,
            currencySign: productInfo.currencySign,
            coinUnlock: productInfo.coinUnlock,
        };
    }
}

export const productService = new ProductService();
