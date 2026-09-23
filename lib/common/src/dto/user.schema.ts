import { UnlockCommType } from "@lib/common/consts/unlock-coin";
import { UserType } from "@lib/common/consts/user";
import z from "zod";

export const UserListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
});

export type UserListReq = z.infer<typeof UserListReqSchema>;

export const UserCoinHistoryReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
});

export type UserCoinHistoryReq = z.infer<typeof UserCoinHistoryReqSchema>;

export const ManageUserDetailReqSchema = z.object({
    userId: z.coerce.number().int().min(1),
});

export type ManageUserDetailReq = z.infer<typeof ManageUserDetailReqSchema>;

export const ManageUserHistoryReqSchema = z.object({
    userId: z.coerce.number().int().min(1),
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
});

export type ManageUserHistoryReq = z.infer<typeof ManageUserHistoryReqSchema>;

export const UserAuthLoginRespSchema = z.object({
    authToken: z.string(),
    code: z.string(),
});
export type UserAuthLoginResp = z.infer<typeof UserAuthLoginRespSchema>;

export const UserAuthInfoRespSchema = z.object({
    bizId: z.string(),
    username: z.string(),
    email: z.string(),
    isLogin: z.boolean(),
    guestCode: z.string(),
    userType: z.nativeEnum(UserType),
});
export type UserAuthInfoResp = z.infer<typeof UserAuthInfoRespSchema>;

export const UserListRespItemSchema = z.object({
    id: z.number().int(),
    bizId: z.string(),
    username: z.string(),
    email: z.string(),
    memberStatus: z.string(),
    expireTime: z.string(),
    coinNum: z.number().int(),
    productHost: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type UserListRespItem = z.infer<typeof UserListRespItemSchema>;

export const UserListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(UserListRespItemSchema),
});
export type UserListResp = z.infer<typeof UserListRespSchema>;

export const UserCoinHistoryItemSchema = z.object({
    coinNum: z.number().int(),
    commType: z.enum(UnlockCommType),
    createTime: z.string(),
});
export type UserCoinHistoryItem = z.infer<typeof UserCoinHistoryItemSchema>;

export const UserCoinHistoryRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(UserCoinHistoryItemSchema),
});
export type UserCoinHistoryResp = z.infer<typeof UserCoinHistoryRespSchema>;

export const ManageUserDetailRespSchema = z.object({
    id: z.number().int(),
    bizId: z.string(),
    username: z.string(),
    email: z.string(),
    memberStatus: z.string(),
    expireTime: z.string(),
    coinNum: z.number().int(),
});
export type ManageUserDetailResp = z.infer<typeof ManageUserDetailRespSchema>;

export const ManageUserWatchHistoryItemSchema = z.object({
    collectionName: z.string(),
    epNum: z.number().int(),
    collectionEpisodes: z.number().int(),
    cutPoint: z.number().int(),
    isDeleted: z.number().int(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type ManageUserWatchHistoryItem = z.infer<typeof ManageUserWatchHistoryItemSchema>;

export const ManageUserWatchHistoryRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(ManageUserWatchHistoryItemSchema),
});
export type ManageUserWatchHistoryResp = z.infer<typeof ManageUserWatchHistoryRespSchema>;

export const ManageUserCoinHistoryItemSchema = z.object({
    coinNum: z.number().int(),
    commType: z.nativeEnum(UnlockCommType),
    collectionName: z.string(),
    epNum: z.number().int(),
    createTime: z.string(),
});
export type ManageUserCoinHistoryItem = z.infer<typeof ManageUserCoinHistoryItemSchema>;

export const ManageUserCoinHistoryRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(ManageUserCoinHistoryItemSchema),
});
export type ManageUserCoinHistoryResp = z.infer<typeof ManageUserCoinHistoryRespSchema>;
