import type { CollectionType } from "@lib/common/consts/collection";
import { Language, LanguageName, RegionName, type Region } from "@lib/common/consts/region";
import type { ProductAddReq, ProductEditReq, ProductListReq, ProductListResp, ProductListRespItem } from "@lib/common/dto/product";
import { formatUnixTime } from "@lib/common/utils/time";
import { productDao } from "@lib/repo/dao/product.dao";

class ProductService {
    async getProductList(req: ProductListReq): Promise<ProductListResp> {
        const search = { search: req.search, region: req.region };
        const [productList, productTotal] = await Promise.all([
            productDao.getProductPage(req.page, req.size, search),
            productDao.getProductCount(search)
        ]);

        return {
            page: req.page,
            size: req.size,
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
                coinUnlock: item.coinUnlock,
                desc: item.desc,
                collectionTypeList: JSON.parse(item.collectionTypeList || "[]") as CollectionType[],
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
            coinUnlock: item.coinUnlock,
            collectionTypeList: JSON.parse(item.collectionTypeList || "[]") as CollectionType[],
            desc: item.desc,
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
            coinUnlock: req.coinUnlock,
            desc: req.desc,
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
            coinUnlock: req.coinUnlock,
            desc: req.desc,
            collectionTypeList: JSON.stringify(req.collectionTypeList),
        });
    }
}

export const productService = new ProductService();
