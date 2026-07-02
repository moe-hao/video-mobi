import { Hono } from "hono";
import { collectionVideoService } from "../services/collection/collection-video.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { videoConfigUnlockReqSchema, videoDownloadReqSchema, videoDownloadVodSchema, videoListReqSchema, videoSyncReqSchema } from "@lib/common/dto/video";


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

export default collectionVideo;
