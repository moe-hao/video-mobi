import type { Readable } from "stream";
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

export async function upload(collectionBizId: string, file: File): Promise<void> {
    const epNum = Number(file.name.split('.')[0]);
    const title = `${collectionBizId}-${epNum}`;

    const videoGuid = await bunnyStreamProxy.createVideo(title);
    await bunnyStreamProxy.uploadVideo(videoGuid, file);
    await saveVideoRecord(collectionBizId, epNum, videoGuid);
}

export async function uploadStream(collectionBizId: string, fileName: string, stream: Readable, contentLength: number): Promise<void> {
    const epNum = Number(fileName.split('.')[0]);
    const title = `${collectionBizId}-${epNum}`;

    const videoGuid = await bunnyStreamProxy.createVideo(title);
    await bunnyStreamProxy.uploadVideoStream(videoGuid, stream, contentLength);
    await saveVideoRecord(collectionBizId, epNum, videoGuid);
}
