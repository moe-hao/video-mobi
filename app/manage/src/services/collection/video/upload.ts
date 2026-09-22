import { ResultCode } from "@lib/common/consts/result";
import { VideoStorage, VideoUploadStatus } from "@lib/common/consts/video";
import type { VideoUploadPrepareResp } from "@lib/common/dto/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { concurrencyLimit } from "@lib/common/utils/concurrency";
import { uuid } from "@lib/common/utils/uuid";
import { logger } from "@lib/internal/base/logger";
import { tos } from "@lib/internal/volcengine/tos";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import { Parser } from "m3u8-parser";

const BUCKET = 'bluearc-video';

/**
 * 切片上传并发数。
 */
const SEGMENT_CONCURRENCY = 10;

/**
 * 预签名有效期，秒。前端需要在有效期内完成上传。
 */
const UPLOAD_EXPIRES = 3600;

function buildKey(collectionBizId: string, vid: string): string {
    return `${collectionBizId}/${vid}`;
}

/**
 * 生成直传 TOS 的预签名地址，浏览器拿到后直接把视频 PUT 到 TOS。
 */
export async function prepareUpload(collectionBizId: string, fileName: string): Promise<VideoUploadPrepareResp> {
    const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
    if (!collectionInfo) {
        throw new InternalException(ResultCode.ResourceNotFound);
    }

    const vid = uuid();
    const key = buildKey(collectionBizId, vid);
    const uploadUrl = tos.getPreSignedUrl({
        bucket: BUCKET,
        key,
        method: 'PUT',
        expires: UPLOAD_EXPIRES,
    });

    return { vid, key, uploadUrl };
}

/**
 * 浏览器直传成功后调用，校验对象已存在再登记视频记录。
 */
export async function confirmUpload(collectionBizId: string, fileName: string, vid: string): Promise<void> {
    const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
    if (!collectionInfo) {
        throw new InternalException(ResultCode.ResourceNotFound);
    }

    const exist = await tos.doesObjectExist({ bucket: BUCKET, key: buildKey(collectionBizId, vid) });
    if (!exist) {
        throw new InternalException(ResultCode.ResourceNotFound.code, 'Upload Object Not Found');
    }

    const [name] = fileName.split('.');
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

export async function fetchCollectionVideoToTos(collectionBizId: string, m3u8URL: string): Promise<string> {
    const resp = await fetch(m3u8URL);
    const m3u8 = await resp.text();

    const parser = new Parser();
    parser.push(m3u8);
    parser.end();

    const segments = parser.manifest.segments;
    if (!segments.length) {
        throw new InternalException(ResultCode.ResourceNotFound.code, 'M3U8 Segment Not Found');
    }

    const vid = uuid();
    const dir = `${collectionBizId}/${vid}`;

    await concurrencyLimit(segments, SEGMENT_CONCURRENCY, async (segment) => {
        const fileName = segment.uri.split('?')[0];
        const segmentUrl = new URL(segment.uri, m3u8URL).toString();

        const segmentResp = await fetch(segmentUrl);
        if (!segmentResp.ok) {
            throw new InternalException(ResultCode.OperationFailed.code, `Fetch Segment Failed: ${fileName}`);
        }

        await tos.putObject({
            bucket: BUCKET,
            key: `${dir}/${fileName}`,
            body: Buffer.from(await segmentResp.arrayBuffer()),
        });
    });

    const manifestKey = `${dir}/main.m3u8`;
    const manifest = segments.reduce((text, segment) => text.replace(segment.uri, segment.uri.split('?')[0]), m3u8);

    await tos.putObject({
        bucket: BUCKET,
        key: manifestKey,
        body: Buffer.from(manifest),
    });

    logger.info(`Fetch Collection Video To Tos Success! ${manifestKey}`);
    return `${vid}/main.m3u8`;
}

