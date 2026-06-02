import type { CollectionItemResp, CollectionListResp } from "@lib/common/dto/collection";
import { collectionFeatureDao } from "@lib/repo/dao/collection-feature.dao";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import type { CollectionSelect } from "@lib/repo/models/collection";

export async function getCollectionPage(page: number, size: number): Promise<CollectionListResp> {
    const [collectionList, total] = await Promise.all([
        collectionDao.getCollectionPage(page, size),
        collectionDao.getCollectionTotal(),
    ]);

    const list = collectionList.map((item) => ({
        bizId: item.bizId,
        name: item.name,
        episodes: item.episodes,
        cover: item.cover,
    }));

    return {
        list: list,
        total: total,
        page: page,
        size: size,
    }
}

export async function getFeaturedCollections(): Promise<CollectionItemResp[]> {
    const collectionFeatureList = await collectionFeatureDao.getFeaturedCollections();
    const collectionIds = collectionFeatureList.map((item) => item.collectionId);
    const collectionList = await collectionDao.getCollectionInIds(collectionIds);

    const collectionIdToInfoMap = new Map<number, CollectionSelect>();
    collectionList.forEach((item) => {
        collectionIdToInfoMap.set(item.id, item);
    });

    return collectionFeatureList.map((item) => ({
        bizId: collectionIdToInfoMap.get(item.collectionId)?.bizId || '',
        name: collectionIdToInfoMap.get(item.collectionId)?.name || '',
        episodes: collectionIdToInfoMap.get(item.collectionId)?.episodes || 0,
        cover: collectionIdToInfoMap.get(item.collectionId)?.cover || '',
    }));
}
