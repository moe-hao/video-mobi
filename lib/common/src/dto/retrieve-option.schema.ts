import z from "zod";

export const RetrieveOptionListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
});

export const RetrieveOptionEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    name: z.string().min(1),
    orderNum: z.coerce.number().min(0).default(0),
    openPaymentNum: z.coerce.number().min(0).default(0),
    relation: z.string().default(''),
});

export const RetrieveOptionAddReqSchema = z.object({
    name: z.string().min(1),
    orderNum: z.coerce.number().min(0).default(0),
    openPaymentNum: z.coerce.number().min(0).default(0),
    relation: z.string().default(''),
});

export const RetrieveOptionDeleteReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
});

export type RetrieveOptionListReq = z.infer<typeof RetrieveOptionListReqSchema>;
export type RetrieveOptionEditReq = z.infer<typeof RetrieveOptionEditReqSchema>;
export type RetrieveOptionAddReq = z.infer<typeof RetrieveOptionAddReqSchema>;
export type RetrieveOptionDeleteReq = z.infer<typeof RetrieveOptionDeleteReqSchema>;

export interface RetrieveOptionListResp {
    page: number;
    size: number;
    total: number;
    list: RetrieveOptionListRespItem[];
}

export interface RetrieveOptionListRespItem {
    id: number;
    name: string;
    orderNum: number;
    openPaymentNum: number;
    relation: string;
    relationName: string;
    createTime: string;
    updateTime: string;
}
