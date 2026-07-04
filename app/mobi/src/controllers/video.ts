import { Hono } from "hono";
import { videoService } from "../services/video/video.service";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { videoLikeReqSchema, videoUnlockCoinReqSchema } from "@lib/common/dto/video";
import { validated } from "@lib/middleware/validated";

const video = new Hono();

video.get('/play_info', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const collectionBizId = c.req.query('collectionBizId') || '';
    const epNum = Number(c.req.query('epNum') || '0');
    const playUrl = await videoService.getVideoPlayInfo(user, collectionBizId, epNum);
    return c.json(success(playUrl));
});

video.get('/like', validated('query', videoLikeReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');

    await videoService.like(user, req.collectionBizId);
    return c.json(success({}));
});

video.get('/like_status', validated('query', videoLikeReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');

    const resp = await videoService.getLikeStatus(user, req.collectionBizId);
    return c.json(success(resp));
});

video.post('/unlock_coin', validated('json', videoUnlockCoinReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('json');

    const resp = await videoService.unlockByCoin(user, req);
    return c.json(success(resp));
});

export default video;
