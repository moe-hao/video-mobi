import { logger } from "@lib/internal/logger";
import { bunnyVideoService } from "../services/video-upload/bunny-video.service";

export async function scheduleVideoUpload() {
    logger.info('[Start Run: scheduleVideoUpload] Start upload collection video');
    await bunnyVideoService.uploadCollectionVideo();
    logger.info('[End Run: scheduleVideoUpload] Upload collection video done');
}
