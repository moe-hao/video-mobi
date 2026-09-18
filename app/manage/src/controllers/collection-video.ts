import { Hono } from "hono";
import { collectionVideoService } from "../services/collection/collection-video.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { videoConfigUnlockReqSchema, videoDetailReqSchema, videoDownloadReqSchema, videoDownloadVodSchema, videoListReqSchema, videoSyncReqSchema, videoUploadConfirmReqSchema, videoUploadPrepareReqSchema } from "@lib/common/dto/video";
import { confirmUpload, prepareUpload } from "../services/collection/video/upload";

const collectionVideo = new Hono();

collectionVideo.get('/list', validated('query', videoListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await collectionVideoService.getCollectionVideoList(req)
    return c.json(success(resp))
});

collectionVideo.get('/detail', validated('query', videoDetailReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await collectionVideoService.getCollectionVideoDetail(req)
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

collectionVideo.post('/upload_prepare', validated('json', videoUploadPrepareReqSchema), async (c) => {
    const req = c.req.valid('json');
    const resp = await prepareUpload(req.collectionBizId, req.fileName);
    return c.json(success(resp));
});

collectionVideo.post('/upload_confirm', validated('json', videoUploadConfirmReqSchema), async (c) => {
    const req = c.req.valid('json');
    await confirmUpload(req.collectionBizId, req.fileName, req.vid);
    return c.json(success())
});

export default collectionVideo;
