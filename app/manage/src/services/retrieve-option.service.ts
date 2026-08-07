import type { RetrieveOptionAddReq, RetrieveOptionEditReq, RetrieveOptionListReq, RetrieveOptionListResp } from "@lib/common/dto/retrieve-option";
import { formatUnixTime } from "@lib/common/utils/time";
import { retrieveOptionDao } from "@lib/repo/dao/retrieve-option.dao";
import { RelationTypeName, type RelationType } from "@lib/common/consts/relation";
import { DeleteStatus } from "@lib/common/consts/common-status";

class RetrieveOptionService {
    async getRetrieveOptionList(req: RetrieveOptionListReq): Promise<RetrieveOptionListResp> {
        const search = { search: req.search };
        const [list, total] = await Promise.all([
            retrieveOptionDao.getRetrieveOptionPage(req.page, req.size, search),
            retrieveOptionDao.getRetrieveOptionCount(search)
        ]);

        return {
            page: req.page,
            size: req.size,
            total,
            list: list.map((item) => ({
                id: item.id,
                name: item.name,
                orderNum: item.orderNum,
                openPaymentNum: item.openPaymentNum,
                relation: item.relation,
                relationName: RelationTypeName[item.relation as RelationType] || item.relation,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        };
    }

    async editRetrieveOption(req: RetrieveOptionEditReq): Promise<void> {
        await retrieveOptionDao.updateRetrieveOptionById(req.id, {
            name: req.name,
            orderNum: req.orderNum,
            openPaymentNum: req.openPaymentNum,
            relation: req.relation,
        });
    }

    async addRetrieveOption(req: RetrieveOptionAddReq): Promise<void> {
        await retrieveOptionDao.addRetrieveOption({
            name: req.name,
            orderNum: req.orderNum,
            openPaymentNum: req.openPaymentNum,
            relation: req.relation,
        });
    }

    async deleteRetrieveOption(id: number): Promise<void> {
        await retrieveOptionDao.updateRetrieveOptionById(id, { isDeleted: DeleteStatus.Deleted });
    }
}

export const retrieveOptionService = new RetrieveOptionService();
