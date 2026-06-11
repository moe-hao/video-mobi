import { collectionDao } from "@lib/repo/dao/collection.dao";
import { historyDao } from "@lib/repo/dao/history.dao";
import type { CollectionSelect } from "@lib/repo/models/collection";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import type { CollectionHistoryReq, CollectionHistoryResp, HistoryDeleteReq, UserHistoryListReq, UserHistoryListResp } from "@lib/common/dto/history";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";

class HistoryService {
    async getHistoryListByUserId(userInfo: UserAuthInfo, req: UserHistoryListReq): Promise<UserHistoryListResp> {
        const [historyList, historyTotal] = await Promise.all([
            historyDao.getHistoryPageByUserId(userInfo.id, req.page, req.size),
            historyDao.getHistoryCountByUserId(userInfo.id),
        ]);

        const collectionIds = historyList.map(item => item.collectionId);
        const collectionList = await collectionDao.getCollectionInIds(collectionIds);
        const collectionIdToInfo = collectionList.reduce((prev, cur) => {
            prev[cur.id] = cur;
            return prev;
        }, {} as Record<number, CollectionSelect>);

        return {
            page: 1,
            size: 10,
            total: historyTotal,
            list: historyList.map(item => ({
                id: item.id,
                collectionBizId: collectionIdToInfo[item.collectionId].bizId,
                collectionEpNum: collectionIdToInfo[item.collectionId].episodes,
                collectionName: collectionIdToInfo[item.collectionId].name,
                collectionCover: collectionIdToInfo[item.collectionId].cover,
                epNum: item.epNum,
            })),
        }
    }

    async getCollectionHistory(userInfo: UserAuthInfo, req: CollectionHistoryReq): Promise<CollectionHistoryResp> {
        const collection = await collectionDao.getCollectionByBizId(req.collectionBizId);
        if (!collection) {
            throw new InternalException(ResultCode.ResourceNotFound.code, "Collection Not Found!");
        }

        const history = await historyDao.getHistoryByUserIdAndCollection(userInfo.id, collection.id);
        return {
            epNum: history ? history.epNum : 1,
        }
    }

    async deleteHistory(userInfo: UserAuthInfo, req: HistoryDeleteReq): Promise<void> {
        const historyItem = await historyDao.getHistoryById(req.id);
        if (historyItem.userId !== userInfo.id) {
            throw new InternalException(ResultCode.ResourceNotFound.code, "History Not Found!");
        }

        await historyDao.updateHistoryById(req.id, {
            isDeleted: DeleteStatus.Deleted,
        });
    }
}

export const historyService = new HistoryService();
