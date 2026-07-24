import { collectionVideoService } from "../services/collection-video.service";

export async function migrateCollectionVideo() {
    await Promise.all([
        collectionVideoService.migrateCollectionVideo(2, 400),
        collectionVideoService.migrateCollectionVideo(401, 800),
        collectionVideoService.migrateCollectionVideo(801, 1281)
    ]);
}

// export async function asyncCollectionVideoUploadStatus() {
//     await collectionVideoService.asyncCollectionVideoUploadStatus(1, 1281);
// }
