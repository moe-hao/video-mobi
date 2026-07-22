import { ResultCode } from "@lib/common/consts/result";
import type { VideoConfigUnlockReq, VideoDownloadReq, VideoDownloadVodReq, VideoDownloadVodResp, VideoListReq, VideoListResp } from "@lib/common/dto/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { currentTime, formatUnixTime } from "@lib/common/utils/time";
import config from "@lib/internal/config";
import { vod } from "@lib/internal/vod";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import { getVideoAuth, getVideoList } from "./video/video";
import { bunnyVideoProxy } from "@lib/repo/proxy/bunny";
import { logger } from "@lib/internal/logger";
import { uuid } from "@lib/common/utils/uuid";
import { tos } from "@lib/internal/tos";

// type UploadMediaUrl = {
//     SourceUrl: string;
//     Title: string;
//     Tags: string;
// }

class CollectionVideoService {
    async getCollectionVideoList(req: VideoListReq): Promise<VideoListResp> {
        const [collectionInfo, videoInfoList, videoInfoTotal] = await Promise.all([
            collectionDao.getCollectionById(req.collectionId),
            videoDao.getCollectionVideoPage(req.page, req.size, req.collectionId),
            videoDao.getCollectionVideoCount(req.collectionId),
        ]);

        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        return {
            page: req.page,
            size: req.size,
            total: videoInfoTotal,
            collectionName: collectionInfo.name,
            collectionBizId: collectionInfo.bizId,
            collectionCutPoint: collectionInfo.cutPoint,
            publishStatus: collectionInfo.publishStatus,
            list: videoInfoList.map((item) => ({
                id: item.id,
                vid: item.vid,
                epNum: item.epNum,
                unlockCoinNum: item.unlockCoinNum,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }

    async download(req: VideoDownloadVodReq): Promise<VideoDownloadVodResp> {
        const videoInfo = await videoDao.getVideoById(req.id);
        if (!videoInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Video Not Found');
        }

        const playInfo = await vod.GetPlayInfo({ Vid: videoInfo.vid });
        const [vodVideoInfo] = playInfo.Result?.PlayInfoList || [];
        if (!vodVideoInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Video Not Found');
        }

        const url = vodVideoInfo.MainPlayUrl.replace('http://', 'https://');
        return { url };
    }

    async syncVodToCollection(id: number): Promise<void> {
        const collectionInfo = await collectionDao.getCollectionById(id);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        const pageSize = 50;
        const total = collectionInfo.episodes;
        const offsets: number[] = [];
        for (let i = 0; i < total; i += pageSize) {
            offsets.push(i);
        }

        await Promise.all(offsets.map(async (offset) => {
            const resp = await vod.GetMediaList({
                Tags: collectionInfo.bizId,
                SpaceName: config.VolSpaceName,
                Offset: offset.toString(),
                PageSize: pageSize.toString(),
            });

            for (const item of resp.Result?.MediaInfoList || []) {
                const [collectionBizId] = item.BasicInfo?.Tags || [];
                if (collectionBizId) {
                    await videoDao.addVideo({
                        collectionId: id,
                        epNum: Number(item.BasicInfo?.Title),
                        vid: item.BasicInfo?.Vid || '',
                        createTime: currentTime(),
                        updateTime: currentTime(),
                    });
                }
            }
        }));
    }

    async downloadCollectionVideoToVod(req: VideoDownloadReq): Promise<void> {
        const collectionInfo = await collectionDao.getCollectionById(req.collectionId);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        const videoAuth = await getVideoAuth();
        const videoList = await getVideoList(videoAuth, collectionInfo.videoId, collectionInfo.episodes);
        await Promise.all(videoList.map(async (video) => {
            const videoName = `${collectionInfo.bizId}-${video.num}`
            const bid = await bunnyVideoProxy.uploadVideoByURL(video.playUrl, videoName);
            await videoDao.addVideo({
                collectionId: collectionInfo.id,
                epNum: video.num,
                bid: bid,
            });
        }));



        // let count = 0;
        // let media: UploadMediaUrl[] = [];
        // for (const video of videoList) {
        //     count++;
        //     media.push({
        //         SourceUrl: video.playUrl,
        //         Title: video.num.toString(),
        //         Tags: collectionInfo.bizId,
        //     });

        //     if (count === 20) {
        //         const result = await vod.UploadMediaByUrl({
        //             URLSets: media,
        //             SpaceName: config.VolSpaceName,
        //         });

        //         logger.info(`Upload Video Success! 20 Videos! result: ${result}`);
        //         media = [];
        //         count = 0;
        //     }
        // }

        // if (media.length > 0) {
        //     const result = await vod.UploadMediaByUrl({
        //         URLSets: media,
        //         SpaceName: config.VolSpaceName,
        //     });

        //     logger.info(`Upload Video Success! ${media.length} Videos! result: ${result}`);
        // }

        const [videoInfo] = videoList;
        const resp = await fetch(videoInfo.coverImage);
        const coverBuffer = await resp.arrayBuffer();

        const fileExtName = videoInfo.coverImage.split('.').pop();
        const filePath = `video_cover/${uuid()}.${fileExtName}`;

        await tos.putObject({
            bucket: 'bluearcshow',
            key: filePath,
            body: Buffer.from(coverBuffer),
        });

        const coverURL = `${config.VolTosUrl}/${filePath}`;
        await collectionDao.updateCollectionById(collectionInfo.id, { cover: coverURL });
        logger.info(`Download Collection Video Success! ${collectionInfo.bizId} ${collectionInfo.episodes} Videos!`);
    }

    async configUnlock(req: VideoConfigUnlockReq): Promise<void> {
        const collectionInfo = await collectionDao.getCollectionById(req.collectionId);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        await Promise.all(req.configList.map(async (item) => {
            if (item.epNum > collectionInfo.cutPoint) {
                await videoDao.updateVideoByCollectionIdAndEpNum(collectionInfo.id, item.epNum, {
                    unlockCoinNum: item.unlockCoin
                });
            }
        }));
    }
}

export const collectionVideoService = new CollectionVideoService();
