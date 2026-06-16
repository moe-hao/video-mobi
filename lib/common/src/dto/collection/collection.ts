import type { CollectionLocal, CollectionType, PublishStatus } from "@lib/common/consts/collection";
import type { Language } from "@lib/common/consts/region";

export interface CollectionListResp {
    page: number;
    size: number;
    total: number;
    list: CollectionItemResp[];
}

export interface CollectionItemResp {
    bizId: string;
    name: string;
    episodes: number;
    cover: string;
}

export interface CollectionTableListResp {
    page: number;
    size: number;
    total: number;
    list: CollectionTableListRespItem[];
}

export interface CollectionTableListRespItem {
    id: number;
    bizId: string;
    name: string;
    sourceName: string;
    episodes: number;
    cutPoint: number;
    publishStatus: PublishStatus;
    cover: string;
    collectionType: CollectionType;
    collectionTypeName: string;
    local: CollectionLocal;
    localName: string;
    languageCode: Language;
    language: string;
    videoId: number;
    desc: string;
    createTime: string;
    updateTime: string;
}

export interface CollectionCoverUploadResp {
    url: string;
}
