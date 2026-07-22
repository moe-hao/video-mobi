import fs from "fs";
import path from "path";
import { DeleteStatus } from "@lib/common/consts/common-status";
import config from "@lib/internal/config";
import { logger } from "@lib/internal/logger";
import { vod } from "@lib/internal/vod";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import { VodPublishStatus } from "@lib/common/consts/collection";

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type FetchVideoResult = {
    id: string;
    success: boolean;
    message: string;
    statusCode: number;
}

export const collectionVideoService = {
    migrateCollectionVideo: async (minCollectionId: number, maxCollectionId: number) => {
        // const minCollectionId = 2;
        // const maxCollectionId = 1265;
        const failedLogPath = path.resolve('migrate-failed.log');
        fs.writeFileSync(failedLogPath, '');

        for (let collectionId = minCollectionId; collectionId <= maxCollectionId; collectionId++) {
            const collectionInfo = await collectionDao.getCollectionById(collectionId);
            if (!collectionInfo || collectionInfo.isDeleted === DeleteStatus.Deleted) {
                continue;
            }

            const videoInfoList = await videoDao.getVideoByCollectionId(collectionId);
            const url = `https://video.bunnycdn.com/library/709966/videos/fetch`
            for (const videoInfo of videoInfoList) {
                if (videoInfo.bid) {
                    continue;
                }

                try {
                    logger.info(`process video: ${videoInfo.vid} ${videoInfo.epNum}`);
                    await vod.UpdateMediaPublishStatus({ Vid: videoInfo.vid, Status: VodPublishStatus.Published });
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
                } catch (e) {
                    logger.error(`process failed: collectionId=${collectionId} videoId=${videoInfo.id} vid=${videoInfo.vid} error=${String(e)}`);
                    fs.appendFileSync(failedLogPath, `collection_id=${collectionId}, video_id=${videoInfo.id}, vid=${videoInfo.vid}, epNum=${videoInfo.epNum}\n`);
                }
            }
        }
    }
}
