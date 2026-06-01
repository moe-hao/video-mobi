import type { CollectionCoverUploadResp } from "@lib/common/dto/collection";
import { uuid } from "@lib/common/utils/uuid";
import config from "@lib/internal/config";
import { tos } from "@lib/internal/tos";

class CollectionCoverService {
    async uploadCollectionCover(file: File): Promise<CollectionCoverUploadResp> {
        const fileExtName = file.name.split('.').pop();
        const filePath = `video_cover/${uuid()}.${fileExtName}`;

        await tos.putObject({
            bucket: 'bluearcshow',
            key: filePath,
            body: Buffer.from(await file.arrayBuffer()),
        });

        const url = `${config.VolTosUrl}/${filePath}`;
        return { url };
    }
}

export const collectionCoverService = new CollectionCoverService();
