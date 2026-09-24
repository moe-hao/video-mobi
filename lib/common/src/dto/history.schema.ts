import z from "zod";

export const UserHistoryListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(10),
});

export type UserHistoryListReq = z.infer<typeof UserHistoryListReqSchema>;

export const CollectionHistoryReqSchema = z.object({
    collectionBizId: z.string().default(''),
});

export type CollectionHistoryReq = z.infer<typeof CollectionHistoryReqSchema>;

export const HistoryDeleteReqSchema = z.object({
    id: z.number(),
});

export type HistoryDeleteReq = z.infer<typeof HistoryDeleteReqSchema>;

export const CollectionHistoryRespSchema = z.object({
    epNum: z.number().int(),
});

export type CollectionHistoryResp = z.infer<typeof CollectionHistoryRespSchema>;

export const UserHistoryListRespItemSchema = z.object({
    id: z.number().int(),
    collectionBizId: z.string(),
    collectionEpNum: z.number().int(),
    collectionName: z.string(),
    collectionCover: z.string(),
    epNum: z.number().int(),
});

export type UserHistoryListRespItem = z.infer<typeof UserHistoryListRespItemSchema>;

export const UserHistoryListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(UserHistoryListRespItemSchema),
});

export type UserHistoryListResp = z.infer<typeof UserHistoryListRespSchema>;
