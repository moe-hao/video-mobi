import { Language, LanguageName, RegionName, type Region } from "@lib/common/consts/region";
import type { ProductAddReq, ProductEditReq, ProductListResp, ProductListRespItem } from "@lib/common/dto/product";
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

    async getAllProductList(): Promise<ProductListRespItem[]> {
        const productList = await productDao.getProductList();
        return productList.map((item) => ({
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
        }));
    }

    async editProduct(req: ProductEditReq): Promise<void> {
        await productDao.updateProductById(req.id, {
            host: req.host,
            region: req.region,
            language: req.language,
            currency: req.currency,
            currencySign: req.currencySign,
            collectionTypeList: JSON.stringify(req.collectionTypeList),
        });
    }

    async addProduct(req: ProductAddReq): Promise<void> {
        await productDao.addProduct({
            host: req.host,
            region: req.region,
            language: req.language,
            currency: req.currency,
            currencySign: req.currencySign,
        });
    }
}

export const productService = new ProductService();
