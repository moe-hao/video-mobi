import z from "zod";

export const userHistoryListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(10),
});

export const collectionHistorySchema = z.object({
    collectionBizId: z.string().default(''),
});

export const historyDeleteReqSchema = z.object({
    id: z.number(),
});

export type UserHistoryListReq = z.infer<typeof userHistoryListReqSchema>;
export type CollectionHistoryReq = z.infer<typeof collectionHistorySchema>;
export type HistoryDeleteReq = z.infer<typeof historyDeleteReqSchema>;
