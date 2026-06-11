import type { CollectionType } from "@lib/common/consts/collection";
import { Language } from "@lib/common/consts/region";
import type { CollectionItemResp, CollectionListResp } from "@lib/common/dto/collection";
import { collectionFeatureDao } from "@lib/repo/dao/collection-feature.dao";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import { productDao } from "@lib/repo/dao/product.dao";
import type { CollectionSelect } from "@lib/repo/models/collection";

export async function getCollectionPage(host: string, page: number, size: number): Promise<CollectionListResp> {
    const productInfo = await productDao.getProductByHost(host);
    const productLanguage = (productInfo?.language || Language.En) as Language;
    const collectionTypeList = JSON.parse(productInfo?.collectionTypeList || '[]') as CollectionType[];

    const [collectionList, total] = await Promise.all([
        collectionDao.getCollectionPage(page, size, productLanguage, collectionTypeList),
        collectionDao.getCollectionTotal(productLanguage, collectionTypeList),
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

export async function getFeaturedCollections(host: string): Promise<CollectionItemResp[]> {
    const productInfo = await productDao.getProductByHost(host);
    const productLanguage = (productInfo?.language || Language.En) as Language;

    const collectionFeatureList = await collectionFeatureDao.getFeaturedCollections();
    const collectionIds = collectionFeatureList.map((item) => item.collectionId);
    const collectionList = await collectionDao.getCollectionInIds(collectionIds);

    const collectionIdToInfoMap = new Map<number, CollectionSelect>();
    collectionList.forEach((item) => {
        collectionIdToInfoMap.set(item.id, item);
    });

    const result: CollectionItemResp[] = [];


    collectionFeatureList.forEach((item) => {
        if (collectionIdToInfoMap.has(item.collectionId) && collectionIdToInfoMap.get(item.collectionId)?.language === productLanguage) {
            result.push({
                bizId: collectionIdToInfoMap.get(item.collectionId)?.bizId || '',
                name: collectionIdToInfoMap.get(item.collectionId)?.name || '',
                episodes: collectionIdToInfoMap.get(item.collectionId)?.episodes || 0,
                cover: collectionIdToInfoMap.get(item.collectionId)?.cover || '',
            });
        }
    });

    return result;
}
