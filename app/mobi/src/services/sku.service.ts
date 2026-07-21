import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { productDao } from "@lib/repo/dao/product.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { paymentOptionItemDao } from "@lib/repo/dao/payment-option-item.dao";
import type { SkuListItem, SkuListResp } from "@lib/common/dto/sku/index";

export const skuService = {
    getProductSkuList: async (host: string, region: string): Promise<SkuListResp> => {
        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const skuList = await skuDao.getSkuListByProductId(productInfo.id);

        const paymentOptionIds = [...new Set(skuList.map((item) => item.paymentOptionId))];
        const paymentOptionItemList = await paymentOptionItemDao.getNormalPaymentOptionItemListInOptionIds(paymentOptionIds);

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
                    paymentList: paymentOptionItemList.filter((paymentItem) => paymentItem.paymentOptionId === item.paymentOptionId).map((value) => ({
                        paymentChannel: value.paymentChannel,
                        paymentType: value.paymentType,
                    })),
                })
            }
        }

        return {
            skuList: resultList,
        }
    },
}
