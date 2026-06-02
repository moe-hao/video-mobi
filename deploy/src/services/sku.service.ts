import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { productDao } from "@lib/repo/dao/product.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import type { SkuListResp } from "@lib/common/dto/sku/index";

class SkuService {
    async getProductSkuList(host: string): Promise<SkuListResp> {
        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const skuList = await skuDao.getSkuListByProductId(productInfo.id);
        return {
            skuList: skuList.map((item) => ({
                bizId: item.bizId,
                price: item.price,
                skuType: item.skuType,
                periodType: item.periodType,
                paypalPlanId: item.paypalPlanId,
            }))
        }
    }
}

export const skuService = new SkuService();
