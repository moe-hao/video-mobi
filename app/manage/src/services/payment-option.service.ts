import type {
    PaymentOptionAddReq,
    PaymentOptionContentItem,
    PaymentOptionDeleteReq,
    PaymentOptionEditReq,
    PaymentOptionItemsReq,
    PaymentOptionListReq,
    PaymentOptionListResp,
} from "@lib/common/dto/payment-option";
import { PaymentOptionDao, paymentOptionDao } from "@lib/repo/dao/payment-option.dao";
import { formatUnixTime } from "@lib/common/utils/time";
import { PaymentOptionItemDao, paymentOptionItemDao } from "@lib/repo/dao/payment-option-item.dao";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { database } from "@lib/internal/database";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";

export const paymentOptionService = {
    getPaymentOptionList: async (req: PaymentOptionListReq): Promise<PaymentOptionListResp> => {
        const [list, total] = await Promise.all([
            paymentOptionDao.getPaymentOptionPageList(req.page, req.size, req.search),
            paymentOptionDao.getPaymentOptionTotal(req.search),
        ]);

        return {
            page: req.page,
            size: req.size,
            total,
            list: list.map((item) => ({
                id: item.id,
                name: item.name,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    },

    addPaymentOption: async (req: PaymentOptionAddReq): Promise<void> => {
        await database.transaction(async (tx) => {
            const paymentOptionTxDao = new PaymentOptionDao(tx);
            const paymentOptionId = await paymentOptionTxDao.addPaymentOption(req.name);

            if (req.content && req.content.length > 0) {
                const items = req.content.map((item, index) => ({
                    paymentOptionId: paymentOptionId,
                    paymentType: item.paymentType,
                    paymentChannel: item.paymentChannel,
                    sort: item.sort ?? index,
                }));

                const paymentOptionItemTxDao = new PaymentOptionItemDao(tx);
                await paymentOptionItemTxDao.addPaymentOptionList(items);
            }
        });
    },

    editPaymentOption: async (req: PaymentOptionEditReq): Promise<void> => {
        await database.transaction(async (tx) => {
            const paymentOptionTxDao = new PaymentOptionDao(tx);
            const paymentOptionItemTxDao = new PaymentOptionItemDao(tx);

            await paymentOptionTxDao.updatePaymentOptionById(req.id, { name: req.name });
            await paymentOptionItemTxDao.updatePaymentOptionItemByPaymentOptionId(req.id, {
                isDeleted: DeleteStatus.Deleted,
            });

            if (req.content && req.content.length > 0) {
                const items = req.content.map((item, index) => ({
                    paymentOptionId: req.id,
                    paymentType: item.paymentType,
                    paymentChannel: item.paymentChannel,
                    sort: item.sort ?? index,
                }));
                await paymentOptionItemTxDao.addPaymentOptionList(items);
            }
        })
    },

    deletePaymentOption: async (req: PaymentOptionDeleteReq): Promise<void> => {
        const skuCount = await skuDao.getSkuCountByPaymentOptionId(req.id);
        if (skuCount > 0) {
            throw new InternalException(ResultCode.OperationFailed.code, '该支付方式下存在商品，不能删除');
        }

        await database.transaction(async (tx) => {
            const paymentOptionTxDao = new PaymentOptionDao(tx);
            await paymentOptionTxDao.updatePaymentOptionById(req.id, { isDeleted: DeleteStatus.Deleted });

            const paymentOptionItemTxDao = new PaymentOptionItemDao(tx);
            await paymentOptionItemTxDao.updatePaymentOptionItemByPaymentOptionId(req.id, {
                isDeleted: DeleteStatus.Deleted,
            });
        });
    },

    getPaymentOptionItems: async (req: PaymentOptionItemsReq): Promise<PaymentOptionContentItem[]> => {
        const items = await paymentOptionItemDao.getPaymentOptionItemsByOptionId(req.paymentOptionId);
        return items.map((item) => ({
            paymentType: item.paymentType,
            paymentChannel: item.paymentChannel,
            sort: item.sort,
        }));
    },
};
