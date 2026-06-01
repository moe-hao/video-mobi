import { Hono } from "hono";
import { videoService } from "../services/video/video.service";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";

const video = new Hono();

video.get('/play_info', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const collectionBizId = c.req.query('collectionBizId') || '';
    const epNum = Number(c.req.query('epNum') || '0');
    const playUrl = await videoService.getVideoPlayInfo(user, collectionBizId, epNum);
    return c.json(success(playUrl));
});

export default video;
