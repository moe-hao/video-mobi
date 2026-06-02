import { ResultCode } from "@lib/common/consts/result";
import type { VideoPlayInfoResp, VideoPlayInfoListItem } from "@lib/common/dto/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { vod } from "@lib/internal/vod";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { memberDao } from "@lib/repo/dao/member.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import type { UserAuthInfo } from "@lib/repo/redis/user";

class VideoService {
    async getVideoPlayInfo(userInfo: UserAuthInfo, collectionBizId: string, epNum: number): Promise<VideoPlayInfoResp> {
        let isValidMember = false;
        const memberInfo = await memberDao.getMemberByUserId(userInfo.id);
        if (memberInfo) {
            isValidMember = true;
        }

        const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        let shouldShowPlayURL = false;
        const playList: VideoPlayInfoListItem[] = [];
        for (let collectionEpNum = 1; collectionEpNum <= collectionInfo.episodes; collectionEpNum++) {
            const videoItem = {
                epNum: collectionEpNum,
                isLock: false,
            };

            if (!isValidMember && collectionInfo.cutPoint !== 0 && collectionEpNum > collectionInfo.cutPoint) {
                videoItem.isLock = true;
            }

            if (collectionEpNum == epNum && !videoItem.isLock) {
                shouldShowPlayURL = true;
            }

            playList.push(videoItem);
        }


        let playURL = '';
        if (shouldShowPlayURL) {
            const video = await videoDao.getVideoByCollectionIdAndEpNum(collectionInfo.id, epNum);
            if (!video.vid) {
                throw new InternalException(ResultCode.ResourceNotFound.code, 'Video Not Found');
            }

            const playInfo = await vod.GetPlayInfo({ Vid: video.vid });
            const mediaInfos = await vod.GetMediaList({ Tags: collectionBizId });
            console.log(mediaInfos.Result);
            const [videoInfo] = playInfo.Result?.PlayInfoList || [];
            if (!videoInfo) {
                throw new InternalException(ResultCode.ResourceNotFound.code, 'Video Not Found');
            }

            playURL = videoInfo.MainPlayUrl.replace('http://', 'https://');
        }



        return {
            collectionBizId: collectionInfo.bizId,
            collectionName: collectionInfo.name,
            collectionEpisodes: collectionInfo.episodes,
            videoList: playList,
            playURL: playURL,
        };
    }
}

export const videoService = new VideoService();
