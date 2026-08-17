import type { UnlockCommType } from "@lib/common/consts/unlock-coin";
import type { UserType } from "@lib/common/consts/user";

export interface UserAuthLoginResp {
    authToken: string;
    code: string;
}

export interface UserAuthInfoResp {
    bizId: string;
    username: string;
    email: string;
    isLogin: boolean;
    guestCode: string;
    userType: UserType;
}

export interface UserListResp {
    page: number;
    size: number;
    total: number;
    list: UserListRespItem[];
}

export interface UserListRespItem {
    id: number;
    bizId: string;
    username: string;
    email: string;
    memberStatus: string;
    expireTime: string;
    coinNum: number;
    productHost: string;
    createTime: string;
    updateTime: string;
}

export interface UserCoinHistoryResp {
    page: number;
    size: number;
    total: number;
    list: UserCoinHistoryItem[];
}

export interface UserCoinHistoryItem {
    coinNum: number;
    commType: UnlockCommType;
    createTime: string;
}

export interface ManageUserDetailResp {
    id: number;
    bizId: string;
    username: string;
    email: string;
    memberStatus: string;
    expireTime: string;
    coinNum: number;
}

export interface ManageUserWatchHistoryResp {
    page: number;
    size: number;
    total: number;
    list: ManageUserWatchHistoryItem[];
}

export interface ManageUserWatchHistoryItem {
    collectionName: string;
    epNum: number;
    collectionEpisodes: number;
    createTime: string;
    updateTime: string;
}

export interface ManageUserCoinHistoryResp {
    page: number;
    size: number;
    total: number;
    list: ManageUserCoinHistoryItem[];
}

export interface ManageUserCoinHistoryItem {
    coinNum: number;
    commType: UnlockCommType;
    collectionName: string;
    epNum: number;
    createTime: string;
}
