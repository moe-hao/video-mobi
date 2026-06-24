import { Hono } from "hono";
import { collectionVideoService } from "../services/collection/collection-video.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { videoDownloadReqSchema, videoDownloadVodSchema, videoListReqSchema, videoSyncReqSchema } from "@lib/common/dto/video";


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
    const response = await collectionVideoService.download(req);
    return c.newResponse(response.body, 200, {
        'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
        'Content-Disposition': 'attachment',
        'X-Accel-Buffering': 'no',
    });
});

export default collectionVideo;
