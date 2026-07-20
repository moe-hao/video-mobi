import { skuDao } from "@lib/repo/dao/sku.dao";
import type { SkuAddReq, SkuEditReq, SkuManageListReq, SkuManageListResp } from "@lib/common/dto/sku";
import { formatUnixTime } from "@lib/common/utils/time";
import { productDao } from "@lib/repo/dao/product.dao";
import type { ProductSelect } from "@lib/repo/models/product";
import { SkuPeriodTypeName, SkuTypeName } from "@lib/common/consts/sku";
import { uuid } from "@lib/common/utils/uuid";
import type { DeleteStatus } from "@lib/common/consts/common-status";
import { paymentOptionDao } from "@lib/repo/dao/payment-option.dao";

class SkuService {
    async getSkuList(req: SkuManageListReq): Promise<SkuManageListResp> {
        const search = {
            search: req.search,
            productId: req.productId,
        };

        const [skuList, skuTotal] = await Promise.all([
            skuDao.getSkuPageList(req.page, req.size, search),
            skuDao.getSkuPageTotal(search),
        ]);

        const productIds = skuList.map((item) => item.productId);
        const paymentOptionIds = skuList.map((item) => item.paymentOptionId).filter(Boolean);
        const [productList, paymentOptionList] = await Promise.all([
            productDao.getProductListInIds(productIds),
            paymentOptionIds.length > 0 ? paymentOptionDao.getPaymentOptionTableList() : Promise.resolve([]),
        ]);
        const productMap = productList.reduce((prev, cur) => {
            prev[cur.id] = cur;
            return prev;
        }, {} as Record<number, ProductSelect>);
        const paymentOptionMap = paymentOptionList.reduce((prev, cur) => {
            prev[cur.id] = cur;
            return prev;
        }, {} as Record<number, typeof paymentOptionList[number]>);

        return {
            page: req.page,
            size: req.size,
            total: skuTotal,
            list: skuList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                productId: item.productId,
                productHost: productMap[item.productId]?.host,
                price: item.price,
                currency: item.currency,
                currencySign: item.currencySign,
                skuType: item.skuType,
                skuTypeName: SkuTypeName[item.skuType as keyof typeof SkuTypeName],
                periodType: item.periodType,
                periodTypeName: SkuPeriodTypeName[item.periodType as keyof typeof SkuPeriodTypeName],
                periodTotal: item.periodTotal,
                paypalPlanId: item.paypalPlanId,
                weight: item.weight,
                coinNum: item.coinNum,
                coinBonus: item.coinBonus,
                desc: item.desc,
                important: item.important,
                paymentOptionId: item.paymentOptionId,
                region: item.region,
                paymentOptionName: paymentOptionMap[item.paymentOptionId]?.name || '',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        }
    }

    async addSku(sku: SkuAddReq): Promise<void> {
        await skuDao.addSku({
            bizId: uuid(),
            productId: sku.productId,
            price: sku.price,
            currency: sku.currency,
            currencySign: sku.currencySign,
            desc: sku.desc,
            skuType: sku.skuType,
            coinNum: sku.coinNum,
            coinBonus: sku.coinBonus,
            periodType: sku.periodType,
            periodTotal: sku.periodTotal,
            weight: sku.weight,
            important: sku.important,
            paypalPlanId: sku.paypalPlanId,
            paymentOptionId: sku.paymentOptionId,
            region: sku.region,
        });
    }

    async updateSku(req: SkuEditReq): Promise<void> {
        await skuDao.updateSkuById(req.id, {
            productId: req.productId,
            price: req.price,
            currency: req.currency,
            currencySign: req.currencySign,
            skuType: req.skuType,
            coinNum: req.coinNum,
            coinBonus: req.coinBonus,
            periodType: req.periodType,
            periodTotal: req.periodTotal,
            weight: req.weight,
            important: req.important,
            desc: req.desc,
            paypalPlanId: req.paypalPlanId,
            paymentOptionId: req.paymentOptionId,
            region: req.region,
        });
    }

    async updateSkuDeleteStatus(id: number, deleteStatus: DeleteStatus): Promise<void> {
        await skuDao.updateSkuById(id, { isDeleted: deleteStatus });
    }
}

export const skuService = new SkuService();
