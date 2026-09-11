import { ResultCode } from "@lib/common/consts/result";
import { VideoStorage, VideoUploadStatus } from "@lib/common/consts/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { uuid } from "@lib/common/utils/uuid";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import { bunnyVideoStorageProxy } from "@lib/repo/proxy/bunny/storage/proxy";

export function validateFileUploadParams(collectionBizId: string | File, file: string | File) {
    if (!collectionBizId || typeof collectionBizId !== "string") {
        throw new InternalException(ResultCode.ParameterInvalid)
    }

    if (!file || !(file instanceof File)) {
        throw new InternalException(ResultCode.ParameterInvalid)
    }

    return { collectionBizId, file };
}

async function saveVideoRecord(collectionBizId: string, epNum: number, videoGuid: string) {
    const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
    if (!collectionInfo) {
        throw new InternalException(ResultCode.ResourceNotFound);
    }

    const videoInfo = await videoDao.getVideoByCollectionIdAndEpNum(collectionInfo.id, epNum);
    if (videoInfo) {
        await videoDao.updateVideoById(videoInfo.id, {
            vid: videoGuid,
            storage: VideoStorage.Bunny,
            uploadStatus: VideoUploadStatus.Processing,
        });
    } else {
        await videoDao.addVideo({
            collectionId: collectionInfo.id,
            epNum: epNum,
            vid: videoGuid,
            storage: VideoStorage.Bunny,
            uploadStatus: VideoUploadStatus.Processing,
        });
    }
}

export async function upload(collectionBizId: string, fileName: string, body: ReadableStream | null): Promise<void> {
    const [name, ext] = fileName.split('.');
    const epNum = Number(name);
    if (!body) {
        throw new InternalException(ResultCode.ParameterInvalid);
    }

    const vid = uuid();
    try {
        // 流式上传：边接收数据边上传到Bunny CDN
        await bunnyVideoStorageProxy.upload(collectionBizId, `${vid}.${ext}`, body);
    } catch (error) {
        // 上传失败时抛出异常
        throw new InternalException(ResultCode.OperationFailed);
    }
    await saveVideoRecord(collectionBizId, epNum, vid);
}
