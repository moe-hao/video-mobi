import { DeleteStatus } from "@lib/common/consts/common-status";
import { LanguageName } from "@lib/common/consts/region";
import { ResultCode } from "@lib/common/consts/result";
import type { CollectionFeatureAddReq, CollectionFeatureDeleteReq, CollectionFeatureEditReq, CollectionFeatureListReq, CollectionFeatureListResp } from "@lib/common/dto/collection";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { currentTime, formatUnixTime } from "@lib/common/utils/time";
import { collectionFeatureDao } from "@lib/repo/dao/collection-feature.dao";
import { collectionDao } from "@lib/repo/dao/collection.dao";

class CollectionFeatureService {
    async getCollectionFeatureList(req: CollectionFeatureListReq): Promise<CollectionFeatureListResp> {
        const searchCollectionList = await collectionDao.getCollectionListBySearch(req.episodeSearch, req.languageCode);
        if (searchCollectionList.length === 0) {
            return {
                page: req.page,
                size: req.size,
                total: 0,
                list: [],
            };
        }

        const searchCollectionIdToInfoMap = new Map(searchCollectionList.map((item) => [item.id, item]));
        const searchCollectionIds = searchCollectionList.map((item) => item.id);

        const [collectionFeatureList, collectionFeatureTotal] = await Promise.all([
            collectionFeatureDao.getCollectionFeatureListPage({ ...req }, searchCollectionIds),
            collectionFeatureDao.getCollectionFeaturePageTotal(searchCollectionIds),
        ]);

        return {
            page: req.page,
            size: req.size,
            total: collectionFeatureTotal,
            list: collectionFeatureList.map((item) => ({
                id: item.id,
                collectionId: item.collectionId,
                weight: item.weight,
                collectionBizId: searchCollectionIdToInfoMap.get(item.collectionId)?.bizId || "",
                name: searchCollectionIdToInfoMap.get(item.collectionId)?.name || "",
                sourceName: searchCollectionIdToInfoMap.get(item.collectionId)?.sourceName || "",
                cover: searchCollectionIdToInfoMap.get(item.collectionId)?.cover || "",
                languageCode: searchCollectionIdToInfoMap.get(item.collectionId)?.language || "",
                language: LanguageName[searchCollectionIdToInfoMap.get(item.collectionId)?.language as keyof typeof LanguageName] || "",
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    }

    async addCollectionFeature(req: CollectionFeatureAddReq): Promise<void> {
        const collectionInfo = await collectionDao.getCollectionById(req.collectionId);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ParameterInvalid.code, "Collection Not Found");
        }

        const collectionFeatureList = await collectionFeatureDao.getCollectionFeatureByCollectionId(req.collectionId);
        if (collectionFeatureList.length > 0) {
            throw new InternalException(ResultCode.ParameterInvalid.code, "Collection Feature Already Exists");
        }

        await collectionFeatureDao.addCollectionFeature({
            collectionId: req.collectionId,
            weight: req.weight,
        });
    }

    async editCollectionFeature(req: CollectionFeatureEditReq): Promise<void> {
        await collectionFeatureDao.updateCollectionFeatureById(req.id, {
            collectionId: req.collectionId,
            weight: req.weight,
            updateTime: currentTime(),
        })
    }

    async deleteCollectionFeature(req: CollectionFeatureDeleteReq): Promise<void> {
        await collectionFeatureDao.updateCollectionFeatureById(req.id, {
            isDeleted: DeleteStatus.Deleted,
            updateTime: currentTime(),
        });
    }
}

export const collectionFeatureService = new CollectionFeatureService();
