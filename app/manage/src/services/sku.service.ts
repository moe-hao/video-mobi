import { skuDao } from "@lib/repo/dao/sku.dao";
import type { SkuAddReq, SkuEditReq, SkuManageListReq, SkuManageListResp } from "@lib/common/dto/sku";
import { formatUnixTime } from "@lib/common/utils/time";
import { productDao } from "@lib/repo/dao/product.dao";
import type { ProductSelect } from "@lib/repo/models/product";
import { SkuPeriodTypeName, SkuTypeName } from "@lib/common/consts/sku";
import { uuid } from "@lib/common/utils/uuid";
import type { DeleteStatus } from "@lib/common/consts/common-status";

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
        const productList = await productDao.getProductListInIds(productIds);
        const productMap = productList.reduce((prev, cur) => {
            prev[cur.id] = cur;
            return prev;
        }, {} as Record<number, ProductSelect>);

        return {
            page: 1,
            size: 20,
            total: skuTotal,
            list: skuList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                productId: item.productId,
                productHost: productMap[item.productId]?.host,
                price: item.price,
                currency: productMap[item.productId]?.currency,
                skuType: item.skuType,
                skuTypeName: SkuTypeName[item.skuType as keyof typeof SkuTypeName],
                periodType: item.periodType,
                periodTypeName: SkuPeriodTypeName[item.periodType as keyof typeof SkuPeriodTypeName],
                paypalPlanId: item.paypalPlanId,
                desc: item.desc,
                important: item.important,
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
            desc: sku.desc,
            skuType: sku.skuType,
            periodType: sku.periodType,
            important: sku.important,
            paypalPlanId: sku.paypalPlanId,
        });
    }

    async updateSku(req: SkuEditReq): Promise<void> {
        await skuDao.updateSkuById(req.id, {
            productId: req.productId,
            price: req.price,
            skuType: req.skuType,
            periodType: req.periodType,
            important: req.important,
            desc: req.desc,
            paypalPlanId: req.paypalPlanId,
        });
    }

    async updateSkuDeleteStatus(id: number, deleteStatus: DeleteStatus): Promise<void> {
        await skuDao.updateSkuById(id, { isDeleted: deleteStatus });
    }
}

export const skuService = new SkuService();
