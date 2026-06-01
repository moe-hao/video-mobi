export interface CollectionFeatureListResp {
    page: number;
    size: number;
    total: number;
    list: CollectionFeatureListRespItem[];
}

export interface CollectionFeatureListRespItem {
    id: number;
    collectionId: number;
    weight: number;
    collectionBizId: string;
    name: string;
    sourceName: string;
    cover: string;
    languageCode: string;
    language: string;
    createTime: string;
    updateTime: string;
}
