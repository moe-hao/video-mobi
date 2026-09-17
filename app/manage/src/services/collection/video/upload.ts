import { Readable } from "stream";
import { ResultCode } from "@lib/common/consts/result";
import { VideoStorage, VideoUploadStatus } from "@lib/common/consts/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { uuid } from "@lib/common/utils/uuid";
import { tos } from "@lib/internal/volcengine/tos";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";

export async function upload(collectionBizId: string, fileName: string, body: ReadableStream<Uint8Array>): Promise<void> {
    const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
    if (!collectionInfo) {
        throw new InternalException(ResultCode.ResourceNotFound);
    }

    const vid = uuid();
    await tos.putObject({
        bucket: 'bluearc-video',
        key: `${collectionBizId}/${vid}`,
        body: Readable.fromWeb(body as any),
    });

    const [name, _] = fileName.split('.');
    const epNum = Number(name);

    const videoInfo = await videoDao.getVideoByCollectionIdAndEpNum(collectionInfo.id, epNum);
    if (videoInfo) {
        await videoDao.updateVideoById(videoInfo.id, {
            vid: vid,
            storage: VideoStorage.Tos,
            uploadStatus: VideoUploadStatus.Success,
        });
    } else {
        await videoDao.addVideo({
            collectionId: collectionInfo.id,
            epNum: epNum,
            vid: vid,
            storage: VideoStorage.Tos,
            uploadStatus: VideoUploadStatus.Success,
        });
    }
}
