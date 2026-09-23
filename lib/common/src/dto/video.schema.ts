import { PublishStatus } from "@lib/common/consts/collection";
import z from "zod";

export const VideoListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    collectionId: z.coerce.number().int().default(0),
});

export type VideoListReq = z.infer<typeof VideoListReqSchema>;

export const VideoSyncReqSchema = z.object({
    collectionId: z.coerce.number().int().default(0),
});

export type VideoSyncReq = z.infer<typeof VideoSyncReqSchema>;

export const VideoDownloadReqSchema = z.object({
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
});

export type VideoDownloadReq = z.infer<typeof VideoDownloadReqSchema>;

export const VideoLikeReqSchema = z.object({
    collectionBizId: z.string().default(''),
});

export type VideoLikeReq = z.infer<typeof VideoLikeReqSchema>;

export const VideoPreviewReqSchema = z.object({
    id: z.int().default(0),
});

export type VideoPreviewReq = z.infer<typeof VideoPreviewReqSchema>;

export const VideoConfigUnlockReqSchema = z.object({
    collectionId: z.coerce.number().int().default(0),
    configList: z.array(z.object({
        epNum: z.coerce.number().int().default(0),
        unlockCoin: z.coerce.number().int().default(0),
    })).default([]),
});

export type VideoConfigUnlockReq = z.infer<typeof VideoConfigUnlockReqSchema>;

export const VideoUnlockCoinReqSchema = z.object({
    collectionBizId: z.string().default(''),
    epNum: z.number().int().default(0),
});

export type VideoUnlockCoinReq = z.infer<typeof VideoUnlockCoinReqSchema>;

export const VideoUploadPrepareReqSchema = z.object({
    collectionBizId: z.string().nonempty({ message: "Param Invalid: collectionBizId" }),
    fileName: z.string().nonempty({ message: "Param Invalid: fileName" }),
});

export type VideoUploadPrepareReq = z.infer<typeof VideoUploadPrepareReqSchema>;

export const VideoUploadConfirmReqSchema = z.object({
    collectionBizId: z.string().nonempty({ message: "Param Invalid: collectionBizId" }),
    fileName: z.string().nonempty({ message: "Param Invalid: fileName" }),
    vid: z.string().nonempty({ message: "Param Invalid: vid" }),
});

export type VideoUploadConfirmReq = z.infer<typeof VideoUploadConfirmReqSchema>;

export const VideoPlayInfoListItemSchema = z.object({
    epNum: z.number().int(),
    isLock: z.boolean(),
});
export type VideoPlayInfoListItem = z.infer<typeof VideoPlayInfoListItemSchema>;

export const VideoPlayInfoRespSchema = z.object({
    collectionBizId: z.string(),
    collectionName: z.string(),
    collectionEpisodes: z.number().int(),
    playURL: z.string(),
    videoList: z.array(VideoPlayInfoListItemSchema),
});
export type VideoPlayInfoResp = z.infer<typeof VideoPlayInfoRespSchema>;

export const VideoListRespItemSchema = z.object({
    id: z.number().int(),
    vid: z.string(),
    epNum: z.number().int(),
    storage: z.string(),
    uploadStatus: z.string(),
    unlockCoinNum: z.number().int(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type VideoListRespItem = z.infer<typeof VideoListRespItemSchema>;

export const VideoListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    collectionName: z.string(),
    collectionBizId: z.string(),
    collectionCutPoint: z.number().int(),
    publishStatus: z.enum(PublishStatus),
    list: z.array(VideoListRespItemSchema),
});
export type VideoListResp = z.infer<typeof VideoListRespSchema>;

export const VideoLikeRespSchema = z.object({
    isLike: z.boolean(),
    likeTotal: z.number().int(),
});
export type VideoLikeResp = z.infer<typeof VideoLikeRespSchema>;

export const VideoPreviewRespSchema = z.object({
    url: z.string(),
});
export type VideoPreviewResp = z.infer<typeof VideoPreviewRespSchema>;

export const VideoUnlockCoinRespSchema = z.object({
    status: z.enum(['success', 'should_payment', 'invalid_unlock']),
});
export type VideoUnlockCoinResp = z.infer<typeof VideoUnlockCoinRespSchema>;

export const VideoUploadPrepareRespSchema = z.object({
    vid: z.string(),
    key: z.string(),
    uploadUrl: z.string(),
});
export type VideoUploadPrepareResp = z.infer<typeof VideoUploadPrepareRespSchema>;
