import { CollectionLocal, CollectionLocalName, CollectionType, CollectionTypeName, PublishStatusToVod } from "@lib/common/consts/collection";
import { LanguageName, type Language } from "@lib/common/consts/region";
import type { CollectionAddReq, CollectionEditReq, CollectionPublishReq, CollectionTableListReq, CollectionTableListResp } from "@lib/common/dto/collection";
import { formatUnixTime } from "@lib/common/utils/time";
import { concurrencyLimit } from "@lib/common/utils/concurrency";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { collectionBizId } from "./collection/generate-biz-id";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { logger } from "@lib/internal/logger";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import { videoDao } from "@lib/repo/dao/video.dao";
import { vod } from "@lib/internal/vod";

class CollectionService {
    async getCollectionList(req: CollectionTableListReq): Promise<CollectionTableListResp> {
        const [collectionList, collectionTotal] = await Promise.all([
            collectionDao.getCollectionListSearch({ ...req }),
            collectionDao.getCollectionTotalSearch({ ...req }),
        ]);

        return {
            page: req.page,
            size: req.size,
            total: collectionTotal,
            list: collectionList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                name: item.name,
                sourceName: item.sourceName,
                episodes: item.episodes,
                cutPoint: item.cutPoint,
                publishStatus: item.publishStatus,
                cover: item.cover,
                languageCode: item.language as Language,
                language: LanguageName[item.language as Language],
                videoId: item.videoId,
                collectionType: item.collectionType,
                collectionTypeName: CollectionTypeName[item.collectionType as CollectionType],
                local: item.local,
                localName: CollectionLocalName[item.local as CollectionLocal],
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        }
    }

    async addCollection(req: CollectionAddReq): Promise<void> {
        const bizId = await collectionBizId();
        const collectionInfo = {
            bizId: bizId,
            sourceName: req.sourceName,
            name: req.name,
            episodes: req.episodes,
            cutPoint: req.cutPoint,
            cover: req.cover,
            language: req.languageCode,
            videoId: req.videoId,
            collectionType: req.collectionType,
            local: req.local,
        }
        await collectionDao.addCollection(collectionInfo);
    }

    async editCollection(req: CollectionEditReq): Promise<void> {
        const collectionInfo = {
            sourceName: req.sourceName,
            name: req.name,
            episodes: req.episodes,
            cutPoint: req.cutPoint,
            language: req.languageCode,
            videoId: req.videoId,
            cover: req.cover,
            collectionType: req.collectionType,
            local: req.local,
        }
        await collectionDao.updateCollectionById(req.id, collectionInfo);
    }

    async deleteCollection(id: number): Promise<void> {
        await collectionDao.updateCollectionById(id, { isDeleted: DeleteStatus.Deleted });
    }

    async updatePublishStatus(req: CollectionPublishReq): Promise<void> {
        const collectionInfo = await collectionDao.getCollectionById(req.id);
        if (!collectionInfo || collectionInfo.isDeleted === DeleteStatus.Deleted) {
            logger.error(`Collection not found or deleted: ${req.id}`);
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Valid!');
        }

        const videoList = await videoDao.getVideoByCollectionId(req.id);
        await concurrencyLimit(videoList, 10, async (item) => {
            await vod.UpdateMediaPublishStatus({ Vid: item.vid, Status: PublishStatusToVod[req.publishStatus] });
        });
        await collectionDao.updateCollectionById(req.id, { publishStatus: req.publishStatus });
    }
}

export const collectionService = new CollectionService();
