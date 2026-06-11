export interface CollectionHistoryResp {
    epNum: number;
}

export interface UserHistoryListResp {
    page: number;
    size: number;
    total: number;
    list: UserHistoryListRespItem[];
}

export interface UserHistoryListRespItem {
    id: number;
    collectionBizId: string;
    collectionEpNum: number;
    collectionName: string;
    collectionCover: string;
    epNum: number;
}
