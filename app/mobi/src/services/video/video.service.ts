import { DeleteStatus } from "@lib/common/consts/common-status";
import { ResultCode } from "@lib/common/consts/result";
import type { VideoPlayInfoResp, VideoPlayInfoListItem, VideoLikeResp, VideoUnlockCoinReq, VideoUnlockCoinResp } from "@lib/common/dto/video";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { vod } from "@lib/internal/vod";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { memberDao } from "@lib/repo/dao/member.dao";
import { userLikeDao } from "@lib/repo/dao/user-like.dao";
import { videoDao } from "@lib/repo/dao/video.dao";
import { historyDao } from "@lib/repo/dao/history.dao";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { currentTime } from "@lib/common/utils/time";
import { userCoinHistoryDao } from "@lib/repo/dao/user-coin-history.dao";
import { UnlockCommType } from "@lib/common/consts/unlock-coin";

class VideoService {
    async getVideoPlayInfo(userInfo: UserAuthInfo, collectionBizId: string, epNum: number): Promise<VideoPlayInfoResp> {
        const [memberInfo, collectionInfo] = await Promise.all([
            memberDao.getMemberByUserId(userInfo.id),
            collectionDao.getCollectionByBizId(collectionBizId),
        ]);

        const userUnlockList = await userCoinHistoryDao.getCoinHistoryListByUserIdAndCollectionId(userInfo.id, collectionInfo.id);

        let isValidMember = false;
        if (memberInfo && memberInfo.expireTime >= currentTime()) {
            isValidMember = true;
        }

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

            const isUserUnlocked = userUnlockList.some(unlock => unlock.epNum === collectionEpNum);
            if (!isValidMember && collectionInfo.cutPoint !== 0 && collectionEpNum > collectionInfo.cutPoint && !isUserUnlocked) {
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
            const [videoInfo] = playInfo.Result?.PlayInfoList || [];
            if (!videoInfo) {
                throw new InternalException(ResultCode.ResourceNotFound.code, 'Video Not Found');
            }

            playURL = videoInfo.MainPlayUrl.replace('http://', 'https://');
        }

        const history = await historyDao.getHistoryByUserIdAndCollection(userInfo.id, collectionInfo.id);
        if (!history) {
            await historyDao.addHistory({
                userId: userInfo.id,
                collectionId: collectionInfo.id,
                epNum: epNum,
            });
        } else {
            await historyDao.updateHistoryById(history.id, {
                epNum: epNum,
            });
        }

        return {
            collectionBizId: collectionInfo.bizId,
            collectionName: collectionInfo.name,
            collectionEpisodes: collectionInfo.episodes,
            playURL: playURL,
            videoList: playList,
        };
    }

    async like(userInfo: UserAuthInfo, collectionBizId: string): Promise<void> {
        const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        const userLike = await userLikeDao.getUserLikeByUserIdAndCollectionId(userInfo.id, collectionInfo.id);
        if (userLike) {
            await userLikeDao.updateUserLike(userLike.id, {
                isDeleted: DeleteStatus.Deleted,
            });
            return
        }

        await userLikeDao.addUserLike({
            userId: userInfo.id,
            collectionId: collectionInfo.id,
        });
    }

    async getLikeStatus(userInfo: UserAuthInfo, collectionBizId: string): Promise<VideoLikeResp> {
        const collectionInfo = await collectionDao.getCollectionByBizId(collectionBizId);
        if (!collectionInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Collection Not Found');
        }

        let isLike = false;
        const [userLike, likeTotal] = await Promise.all([
            userLikeDao.getUserLikeByUserIdAndCollectionId(userInfo.id, collectionInfo.id),
            userLikeDao.getUserLikeTotalByCollectionId(collectionInfo.id),
        ]);
        if (userLike) {
            isLike = true;
        }

        return {
            isLike: isLike,
            likeTotal: likeTotal + collectionInfo.mockLike,
        };
    }

    async unlockByCoin(userInfo: UserAuthInfo, req: VideoUnlockCoinReq): Promise<VideoUnlockCoinResp> {
        const [memberInfo, collectionInfo] = await Promise.all([
            memberDao.getMemberByUserId(userInfo.id),
            collectionDao.getCollectionByBizId(req.collectionBizId),
        ]);

        const currentVideoInfo = await videoDao.getVideoByCollectionIdAndEpNum(collectionInfo.id, req.epNum);
        if (!memberInfo || memberInfo.coinNum === 0 || memberInfo.coinNum < currentVideoInfo.unlockCoinNum) {
            return { status: 'should_payment' };
        }

        const userUnlockList = (await userCoinHistoryDao.getCoinHistoryListByUserIdAndCollectionId(userInfo.id, collectionInfo.id)).filter(u => u.commType === UnlockCommType.Expense);
        console.log(userUnlockList);
        const prevEpNum = req.epNum - 1;
        if (prevEpNum !== collectionInfo.cutPoint && !userUnlockList.some(u => u.epNum === prevEpNum)) {
            return { status: 'invalid_unlock' };
        }

        const memberInfoCoinNum = memberInfo.coinNum - currentVideoInfo.unlockCoinNum;
        await memberDao.updateMemberById(memberInfo.id, {
            coinNum: memberInfoCoinNum,
        });

        await userCoinHistoryDao.addUserCoinHistory({
            userId: userInfo.id,
            collectionId: collectionInfo.id,
            coinNum: currentVideoInfo.unlockCoinNum,
            epNum: req.epNum,
            commType: UnlockCommType.Expense,
        });

        return { status: 'success' };
    }
}

export const videoService = new VideoService();
