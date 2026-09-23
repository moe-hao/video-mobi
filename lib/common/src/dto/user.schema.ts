import type { UnlockCommType } from "@lib/common/consts/unlock-coin";
import type { UserType } from "@lib/common/consts/user";
import z from "zod";

export const UserListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
});

export const UserCoinHistoryReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
});

export const ManageUserDetailReqSchema = z.object({
    userId: z.coerce.number().int().min(1),
});

export const ManageUserHistoryReqSchema = z.object({
    userId: z.coerce.number().int().min(1),
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
});

export type UserListReq = z.infer<typeof UserListReqSchema>;
export type UserCoinHistoryReq = z.infer<typeof UserCoinHistoryReqSchema>;
export type ManageUserDetailReq = z.infer<typeof ManageUserDetailReqSchema>;
export type ManageUserHistoryReq = z.infer<typeof ManageUserHistoryReqSchema>;

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
    cutPoint: number;
    isDeleted: number;
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
