import config from "@lib/internal/config";
import { logger } from "@lib/internal/logger";
import { vod } from "@lib/internal/vod";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";

type FetchVideoResult = {
    id: string;
    success: boolean;
    message: string;
    statusCode: number;
}

export const collectionVideoService = {
    migrateCollectionVideo: async () => {
        const collectionInfo = await collectionDao.getCollectionById(1);
        const videoInfoList = await videoDao.getVideoByCollectionId(1);

        const url = `https://video.bunnycdn.com/library/709966/videos/fetch`
        for (const videoInfo of videoInfoList) {
            logger.info(`process video: ${videoInfo.vid} ${videoInfo.epNum}`);
            const playInfo = await vod.GetPlayInfo({ Vid: videoInfo.vid });
            const [vodVideoInfo] = playInfo.Result?.PlayInfoList || [];

            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'AccessKey': config.BunnyApiAccessKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: vodVideoInfo.MainPlayUrl,
                    title: `${collectionInfo.bizId}-${videoInfo.epNum}`
                })
            });

            const result = await resp.json() as FetchVideoResult;
            await videoDao.updateVideoById(videoInfo.id, { bid: result.id });
            logger.info(`process success: ${videoInfo.vid} ${videoInfo.epNum}`);
        }
    }
}
