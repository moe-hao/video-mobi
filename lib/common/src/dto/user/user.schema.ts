import z from "zod";

export const userListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
});

export const userCoinHistoryReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
});

export type UserListReq = z.infer<typeof userListReqSchema>;
export type UserCoinHistoryReq = z.infer<typeof userCoinHistoryReqSchema>;
