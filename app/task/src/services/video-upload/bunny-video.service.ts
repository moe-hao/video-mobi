import { VideoUploadStatus } from "@lib/common/consts/video";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { getVideoAuth, getVideoList } from "./upload/video";
import { uploadVideoToBunny } from "./upload/upload-bunny";
import { videoDao } from "@lib/repo/dao/video.dao";

class BunnyVideoService {
    async uploadCollectionVideo() {
        const videoAuth = await getVideoAuth();

        const collections = await collectionDao.getCollectionByUploadStatus(VideoUploadStatus.Created);
        for (const collectionInfo of collections) {
            let failedCount = 0;
            const videoList = await getVideoList(videoAuth, collectionInfo.videoId, collectionInfo.episodes);
            videoList.map(async (video) => {
                const videoInfo = await videoDao.getVideoByCollectionIdAndEpNum(collectionInfo.id, video.num);
                if (videoInfo && videoInfo.uploadStatus === VideoUploadStatus.Succeed) {
                    return;
                }

                let videoId = 0;
                if (videoInfo) {
                    videoId = videoInfo.id;
                } else {
                    videoId = await videoDao.addVideo({
                        collectionId: collectionInfo.id,
                        epNum: video.num,
                        uploadStatus: VideoUploadStatus.Created,
                    });
                }

                try {
                    const result = await uploadVideoToBunny(collectionInfo.bizId, video.playUrl);
                    let bid = `${result.videoName}.mp4`;
                    if (result.videoType === 'm3u8') {
                        bid = `${result.videoName}/main.m3u8`;
                    }

                    await videoDao.updateVideoById(videoId, { bid: bid, uploadStatus: VideoUploadStatus.Succeed });
                } catch (error) {
                    failedCount++;
                    await videoDao.updateVideoById(videoId, { uploadStatus: VideoUploadStatus.Failed });
                }
            });

            if (failedCount === 0) {
                await collectionDao.updateCollectionById(collectionInfo.id, { uploadStatus: VideoUploadStatus.Succeed });
            }
        }
    }
}

export const bunnyVideoService = new BunnyVideoService();
