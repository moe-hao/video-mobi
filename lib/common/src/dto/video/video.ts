import type { PublishStatus } from "@lib/common/consts/collection";

export interface VideoPlayInfoResp {
    collectionBizId: string;
    collectionName: string;
    collectionEpisodes: number;
    playURL: string;
    videoList: VideoPlayInfoListItem[];
}

export interface VideoPlayInfoListItem {
    epNum: number;
    isLock: boolean;
}

export interface VideoListResp {
    page: number;
    size: number;
    total: number;
    collectionName: string;
    collectionBizId: string;
    publishStatus: PublishStatus;
    list: VideoListRespItem[];
}

export interface VideoListRespItem {
    id: number;
    vid: string;
    epNum: number;
    createTime: string;
    updateTime: string;
}

export interface VideoLikeResp {
    isLike: boolean;
    likeTotal: number;
}

export interface VideoDownloadVodResp {
    url: string;
}
