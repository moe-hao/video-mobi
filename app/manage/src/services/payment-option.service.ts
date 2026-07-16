import type { PaymentOptionAddReq, PaymentOptionContentItem, PaymentOptionDeleteReq, PaymentOptionEditReq, PaymentOptionItemsReq, PaymentOptionListReq, PaymentOptionListResp } from "@lib/common/dto/payment-option";
import { createPaymentOption, paymentOptionDao, updatePaymentOptionById } from "@lib/repo/dao/payment-option.dao";
import { formatUnixTime } from "@lib/common/utils/time";
import { paymentOptionItemDao } from "@lib/repo/dao/payment-option-item.dao";
import { DeleteStatus } from "@lib/common/consts/common-status";

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
        await createPaymentOption(req.name, req.content);
    },

    editPaymentOption: async (req: PaymentOptionEditReq): Promise<void> => {
        await updatePaymentOptionById(req.id, req.name, req.content)
    },

    deletePaymentOption: async (req: PaymentOptionDeleteReq): Promise<void> => {
        await paymentOptionDao.updatePaymentOptionDeleteStatus(req.id, DeleteStatus.Deleted);
    },

    getPaymentOptionItems: async (req: PaymentOptionItemsReq): Promise<PaymentOptionContentItem[]> => {
        const items = await paymentOptionItemDao.getPaymentOptionItemsByOptionId(req.paymentOptionId);
        return items.map((item) => ({
            paymentType: item.paymentType,
            paymentChannel: item.paymentChannel,
        }));
    },
};
