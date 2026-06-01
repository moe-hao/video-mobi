import { Language, LanguageName, RegionName, type Region } from "@lib/common/consts/region";
import type { ProductListResp } from "@lib/common/dto/product";
import { formatUnixTime } from "@lib/common/utils/time";
import { productDao } from "@lib/repo/dao/product.dao";

class ProductService {
    async getProductList(): Promise<ProductListResp> {
        const [productList, productTotal] = await Promise.all([
            productDao.getProductPage(1, 10),
            productDao.getProductCount()
        ]);

        return {
            page: 1,
            size: 10,
            total: productTotal,
            list: productList.map((item) => ({
                id: item.id,
                host: item.host,
                region: item.region as Region,
                regionName: RegionName[item.region as Region],
                language: item.language as Language,
                languageName: LanguageName[item.language as Language],
                currency: item.currency,
                currencySign: item.currencySign,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        };

    }
}

export const productService = new ProductService();
