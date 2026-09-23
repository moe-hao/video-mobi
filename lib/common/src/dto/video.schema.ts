import type { PublishStatus } from "@lib/common/consts/collection";
import type { UnlockStatus } from "@lib/common/consts/unlock-coin";
import z from "zod";

export const VideoListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    collectionId: z.coerce.number().int().default(0),
});

export const VideoSyncReqSchema = z.object({
    collectionId: z.coerce.number().int().default(0),
});

export const VideoDownloadReqSchema = z.object({
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
});

export const VideoLikeReqSchema = z.object({
    collectionBizId: z.string().default(''),
});

export const VideoPreviewReqSchema = z.object({
    id: z.int().default(0),
});

export const VideoConfigUnlockReqSchema = z.object({
    collectionId: z.coerce.number().int().default(0),
    configList: z.array(z.object({
        epNum: z.coerce.number().int().default(0),
        unlockCoin: z.coerce.number().int().default(0),
    })).default([]),
});

export const VideoUnlockCoinReqSchema = z.object({
    collectionBizId: z.string().default(''),
    epNum: z.number().int().default(0),
});

export const VideoUploadPrepareReqSchema = z.object({
    collectionBizId: z.string().nonempty({ message: "Param Invalid: collectionBizId" }),
    fileName: z.string().nonempty({ message: "Param Invalid: fileName" }),
});

export const VideoUploadConfirmReqSchema = z.object({
    collectionBizId: z.string().nonempty({ message: "Param Invalid: collectionBizId" }),
    fileName: z.string().nonempty({ message: "Param Invalid: fileName" }),
    vid: z.string().nonempty({ message: "Param Invalid: vid" }),
});

export type VideoListReq = z.infer<typeof VideoListReqSchema>;
export type VideoSyncReq = z.infer<typeof VideoSyncReqSchema>;
export type VideoDownloadReq = z.infer<typeof VideoDownloadReqSchema>;
export type VideoLikeReq = z.infer<typeof VideoLikeReqSchema>;
export type VideoPreviewReq = z.infer<typeof VideoPreviewReqSchema>;
export type VideoConfigUnlockReq = z.infer<typeof VideoConfigUnlockReqSchema>;
export type VideoUnlockCoinReq = z.infer<typeof VideoUnlockCoinReqSchema>;
export type VideoUploadPrepareReq = z.infer<typeof VideoUploadPrepareReqSchema>;
export type VideoUploadConfirmReq = z.infer<typeof VideoUploadConfirmReqSchema>;

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
