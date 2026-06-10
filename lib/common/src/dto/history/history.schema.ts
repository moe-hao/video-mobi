import z from "zod";

export const userHistoryListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(10),
});

export const historyDeleteReqSchema = z.object({
    id: z.number(),
});

export type UserHistoryListReq = z.infer<typeof userHistoryListReqSchema>;
export type HistoryDeleteReq = z.infer<typeof historyDeleteReqSchema>;
