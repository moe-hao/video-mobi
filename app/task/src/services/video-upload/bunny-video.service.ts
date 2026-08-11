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
            const videoList = await getVideoList(videoAuth, collectionInfo.videoId, collectionInfo.episodes);
            for (const video of videoList) {
                const result = await uploadVideoToBunny(collectionInfo.bizId, video.playUrl);

                let bid = `${result.videoName}.mp4`
                if (result.videoType === 'm3u8') {
                    bid = `${result.videoName}/main.m3u8`
                }

                videoDao.addVideo({
                    collectionId: collectionInfo.id,
                    epNum: video.num,
                    bid: bid,
                });
            }
        }
    }
}

export const bunnyVideoService = new BunnyVideoService();
