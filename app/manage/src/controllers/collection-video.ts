import { Hono } from "hono";
import { collectionVideoService } from "../services/collection/collection-video.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { videoConfigUnlockReqSchema, videoDownloadReqSchema, videoDownloadVodSchema, videoListReqSchema, videoSyncReqSchema } from "@lib/common/dto/video";
import { upload, uploadStream, validateFileUploadParams } from "../services/collection/video/upload";
import type { IncomingMessage } from "http";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";

const collectionVideo = new Hono();

collectionVideo.get('/list', validated('query', videoListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await collectionVideoService.getCollectionVideoList(req)
    return c.json(success(resp))
});

collectionVideo.post('/sync', validated('json', videoSyncReqSchema), async (c) => {
    const req = c.req.valid('json');
    await collectionVideoService.syncVodToCollection(req.collectionId)
    return c.json(success())
});

collectionVideo.post('/download_video', validated('json', videoDownloadReqSchema), async (c) => {
    const req = c.req.valid('json');
    const resp = await collectionVideoService.downloadCollectionVideoToVod(req);
    return c.json(success(resp));
});

collectionVideo.post('/download', validated('json', videoDownloadVodSchema), async (c) => {
    const req = c.req.valid('json');
    const resp = await collectionVideoService.download(req);
    return c.json(success(resp));
});

collectionVideo.post('/config_unlock', validated('json', videoConfigUnlockReqSchema), async (c) => {
    const req = c.req.valid('json');
    await collectionVideoService.configUnlock(req);
    return c.json(success())
});

collectionVideo.post('/upload', async (c) => {
    const body = await c.req.parseBody();
    const { collectionBizId, file } = validateFileUploadParams(body.collectionBizId, body.file);
    await upload(collectionBizId, file);
    return c.json(success())
});

collectionVideo.put('/upload_stream', async (c) => {
    const collectionBizId = c.req.query('collectionBizId');
    const fileName = c.req.query('fileName');
    const contentLength = Number(c.req.header('content-length') || '0');

    if (!collectionBizId || !fileName || !contentLength) {
        throw new InternalException(ResultCode.ParameterInvalid);
    }

    const incoming = (c.env as any).incoming as IncomingMessage;
    await uploadStream(collectionBizId, fileName, incoming, contentLength);
    return c.json(success())
});

export default collectionVideo;
