import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { productDao } from "@lib/repo/dao/product.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { paymentOptionItemDao } from "@lib/repo/dao/payment-option-item.dao";
import type { SkuListResp } from "@lib/common/dto/sku/index";

export const skuService = {
    getProductSkuList: async (host: string): Promise<SkuListResp> => {
        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const skuList = await skuDao.getSkuListByProductId(productInfo.id);
        const paymentOptionIds = [...new Set(skuList.map((item) => item.paymentOptionId))];
        const paymentOptionItemList = await paymentOptionItemDao.getNormalPaymentOptionItemListInOptionIds(paymentOptionIds);

        return {
            skuList: skuList.map((item) => ({
                bizId: item.bizId,
                price: item.price,
                skuType: item.skuType,
                periodType: item.periodType,
                paypalPlanId: item.paypalPlanId,
                coinNum: item.coinNum,
                coinBonus: item.coinBonus,
                desc: item.desc,
                important: item.important,
                paymentList: paymentOptionItemList.filter((paymentItem) => paymentItem.paymentOptionId === item.paymentOptionId).map((value) => ({
                    paymentChannel: value.paymentChannel,
                    paymentType: value.paymentType,
                })),
            }))
        }
    },
}
