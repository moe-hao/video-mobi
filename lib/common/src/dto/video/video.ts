import type { PublishStatus } from "@lib/common/consts/collection";
import type { UnlockStatus } from "@lib/common/consts/unlock-coin";

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
    collectionCutPoint: number;
    publishStatus: PublishStatus;
    list: VideoListRespItem[];
}

export interface VideoListRespItem {
    id: number;
    vid: string;
    epNum: number;
    storage: string;
    uploadStatus: string;
    unlockCoinNum: number;
    createTime: string;
    updateTime: string;
}

export interface VideoLikeResp {
    isLike: boolean;
    likeTotal: number;
}

export interface VideoPreviewResp {
    url: string;
}

export interface VideoUnlockCoinResp {
    status: UnlockStatus;
}

export interface VideoUploadPrepareResp {
    vid: string;
    key: string;
    uploadUrl: string;
}
