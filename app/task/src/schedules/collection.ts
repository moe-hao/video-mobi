import { collectionVideoService } from "../services/collection-video.service";

export async function migrateCollectionVideo() {
    await collectionVideoService.migrateCollectionVideo();
}
