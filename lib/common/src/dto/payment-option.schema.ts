import z from "zod";

export const PaymentOptionContentItemSchema = z.object({
    paymentType: z.string().min(1, '支付类型不能为空'),
    paymentChannel: z.string().min(1, '支付渠道不能为空'),
    sort: z.number().optional(),
});

export const PaymentOptionListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
});

export const PaymentOptionAddReqSchema = z.object({
    name: z.string().min(1, '名称不能为空'),
    content: z.array(PaymentOptionContentItemSchema).default([]),
});

export const PaymentOptionEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    name: z.string().min(1, '名称不能为空'),
    content: z.array(PaymentOptionContentItemSchema).default([]),
});

export const PaymentOptionDeleteReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
});

export const PaymentOptionItemsReqSchema = z.object({
    paymentOptionId: z.coerce.number().nonoptional(),
});

export type PaymentOptionListReq = z.infer<typeof PaymentOptionListReqSchema>;
export type PaymentOptionAddReq = z.infer<typeof PaymentOptionAddReqSchema>;
export type PaymentOptionEditReq = z.infer<typeof PaymentOptionEditReqSchema>;
export type PaymentOptionDeleteReq = z.infer<typeof PaymentOptionDeleteReqSchema>;
export type PaymentOptionContentItemReq = z.infer<typeof PaymentOptionContentItemSchema>;
export type PaymentOptionItemsReq = z.infer<typeof PaymentOptionItemsReqSchema>;

export interface PaymentOptionListResp {
    page: number;
    size: number;
    total: number;
    list: PaymentOptionListRespItem[];
}

export interface PaymentOptionContentItem {
    paymentType: string;
    paymentChannel: string;
    sort?: number;
}

export interface PaymentOptionListRespItem {
    id: number;
    name: string;
    createTime: string;
    updateTime: string;
}
