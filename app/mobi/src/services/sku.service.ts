import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { productDao } from "@lib/repo/dao/product.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import type { SkuListItem, SkuListResp } from "@lib/common/dto/sku/index";

class SkuService {
    async getProductSkuList(host: string, region: string): Promise<SkuListResp> {
        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const skuList = await skuDao.getSkuListByProductId(productInfo.id);
        const resultList: SkuListItem[] = [];

        for (const item of skuList) {
            if (item.region === region || item.region === '') {
                resultList.push({
                    bizId: item.bizId,
                    price: item.price,
                    currency: item.currency,
                    currencySign: item.currencySign,
                    skuType: item.skuType,
                    periodType: item.periodType,
                    paypalPlanId: item.paypalPlanId,
                    coinNum: item.coinNum,
                    coinBonus: item.coinBonus,
                    desc: item.desc,
                    important: item.important,
                })
            }
        }

        return {
            skuList: resultList,
        }
    }
}

export const skuService = new SkuService();
