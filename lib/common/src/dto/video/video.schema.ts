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

export type VideoListReq = z.infer<typeof videoListReqSchema>;
export type VideoSyncReq = z.infer<typeof videoSyncReqSchema>;
export type VideoDownloadReq = z.infer<typeof videoDownloadReqSchema>;
