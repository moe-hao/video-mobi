import z from "zod";

export const RetrieveOptionListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
});

export type RetrieveOptionListReq = z.infer<typeof RetrieveOptionListReqSchema>;

export const RetrieveOptionEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    name: z.string().min(1),
    orderNum: z.coerce.number().min(0).default(0),
    openPaymentNum: z.coerce.number().min(0).default(0),
    relation: z.string().default(''),
});

export type RetrieveOptionEditReq = z.infer<typeof RetrieveOptionEditReqSchema>;

export const RetrieveOptionAddReqSchema = z.object({
    name: z.string().min(1),
    orderNum: z.coerce.number().min(0).default(0),
    openPaymentNum: z.coerce.number().min(0).default(0),
    relation: z.string().default(''),
});

export type RetrieveOptionAddReq = z.infer<typeof RetrieveOptionAddReqSchema>;

export const RetrieveOptionDeleteReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
});

export type RetrieveOptionDeleteReq = z.infer<typeof RetrieveOptionDeleteReqSchema>;

export const RetrieveOptionListRespItemSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    orderNum: z.number().int(),
    openPaymentNum: z.number().int(),
    relation: z.string(),
    relationName: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type RetrieveOptionListRespItem = z.infer<typeof RetrieveOptionListRespItemSchema>;

export const RetrieveOptionListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(RetrieveOptionListRespItemSchema),
});
export type RetrieveOptionListResp = z.infer<typeof RetrieveOptionListRespSchema>;
