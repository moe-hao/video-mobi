import { ResultCode } from "@lib/common/consts/result";
import { VideoStorage, VideoUploadStatus } from "@lib/common/consts/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import { bunnyStreamProxy } from "@lib/repo/proxy/bunny/stream/proxy";

export function validateFileUploadParams(collectionBizId: string | File, file: string | File) {
    if (!collectionBizId || typeof collectionBizId !== "string") {
        throw new InternalException(ResultCode.ParameterInvalid)
    }

    if (!file || !(file instanceof File)) {
        throw new InternalException(ResultCode.ParameterInvalid)
    }

    return { collectionBizId, file };
}

export async function upload(collectionBizId: string, file: File): Promise<void> {
    const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
    if (!collectionInfo) {
        throw new InternalException(ResultCode.ResourceNotFound);
    }

    const originFileName = file.name;
    const epNum = Number(originFileName.split('.')[0]);
    const title = `${collectionBizId}-${epNum}`;

    const videoGuid = await bunnyStreamProxy.createVideo(title);
    await bunnyStreamProxy.uploadVideo(videoGuid, file);

    const videoInfo = await videoDao.getVideoByCollectionIdAndEpNum(collectionInfo.id, epNum);
    if (videoInfo) {
        videoDao.updateVideoById(videoInfo.id, {
            vid: videoGuid,
            storage: VideoStorage.Bunny,
            uploadStatus: VideoUploadStatus.Processing,
        });
    } else {
        videoDao.addVideo({
            collectionId: collectionInfo.id,
            epNum: epNum,
            vid: videoGuid,
            storage: VideoStorage.Bunny,
            uploadStatus: VideoUploadStatus.Processing,
        });
    }
}
