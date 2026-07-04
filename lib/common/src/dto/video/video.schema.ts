import z from "zod";

export const videoListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    collectionId: z.coerce.number().int().default(0),
});

export const videoSyncReqSchema = z.object({
    collectionId: z.coerce.number().int().default(0),
});

export const videoDownloadReqSchema = z.object({
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
});

export const videoLikeReqSchema = z.object({
    collectionBizId: z.string().default(''),
});

export const videoDownloadVodSchema = z.object({
    id: z.int().default(0),
});

export const videoConfigUnlockReqSchema = z.object({
    collectionId: z.coerce.number().int().default(0),
    configList: z.array(z.object({
        epNum: z.coerce.number().int().default(0),
        unlockCoin: z.coerce.number().int().default(0),
    })).default([]),
});

export const videoUnlockCoinReqSchema = z.object({
    collectionBizId: z.string().default(''),
    epNum: z.number().int().default(0),
});

export type VideoListReq = z.infer<typeof videoListReqSchema>;
export type VideoSyncReq = z.infer<typeof videoSyncReqSchema>;
export type VideoDownloadReq = z.infer<typeof videoDownloadReqSchema>;
export type VideoLikeReq = z.infer<typeof videoLikeReqSchema>;
export type VideoDownloadVodReq = z.infer<typeof videoDownloadVodSchema>;
export type VideoConfigUnlockReq = z.infer<typeof videoConfigUnlockReqSchema>;
export type VideoUnlockCoinReq = z.infer<typeof videoUnlockCoinReqSchema>;
