import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { productDao } from "@lib/repo/dao/product.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { paymentOptionItemDao } from "@lib/repo/dao/payment-option-item.dao";
import { retrieveOptionDao } from "@lib/repo/dao/retrieve-option.dao";
import type { SkuListItem, SkuListResp, SkuRetrieveInfo } from "@lib/common/dto/sku/index";
import type { RelationType } from "@lib/common/consts/relation";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { memberDao } from "@lib/repo/dao/member.dao";
import { currentTime } from "@lib/common/utils/time";


export async function getProductSkuList(host: string, region: string): Promise<SkuListResp> {
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
                firstPeriodPrice: item.firstPeriodPrice,
                price: item.price,
                currency: item.currency,
                currencySign: item.currencySign,
                skuType: item.skuType,
                periodType: item.periodType,
                paypalPlanId: item.paypalPlanId,
                coinNum: item.coinNum,
                coinBonus: item.coinBonus,
                isRetrieve: item.isRetrieve,
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
}

export async function getProductSkuRetrieveInfo(host: string, region: string, user: UserAuthInfo): Promise<SkuRetrieveInfo> {
    const memberInfo = await memberDao.getMemberByUserId(user.id);
    if (memberInfo) {
        // 如果会员没有过期，直接返回false
        const nowTime = currentTime();
        if (nowTime <= memberInfo.expireTime) {
            return {
                exist: false,
            } as SkuRetrieveInfo;
        }
    }

    const productInfo = await productDao.getProductByHost(host);
    if (!productInfo) {
        throw new InternalException(ResultCode.ResourceNotFound);
    }

    const skuList = await skuDao.getSkuListByProductId(productInfo.id);
    const retrieveSkuInfo = skuList.find((item) => (
        item.isRetrieve === 1 && (item.region === '' || item.region === region)
    ));

    if (!retrieveSkuInfo) {
        return {
            exist: false,
        } as SkuRetrieveInfo;
    }

    const retrieveOptionInfo = await retrieveOptionDao.getRetrieveOptionById(retrieveSkuInfo.retrieveOptionId);
    if (!retrieveOptionInfo) {
        return {
            exist: false,
        } as SkuRetrieveInfo;
    }

    return {
        exist: true,
        orderNum: retrieveOptionInfo.orderNum,
        openPaymentNum: retrieveOptionInfo.openPaymentNum,
        relation: retrieveOptionInfo.relation as RelationType,
    } as SkuRetrieveInfo;
}
