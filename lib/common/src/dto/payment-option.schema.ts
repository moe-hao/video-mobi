import z from "zod";

export const PaymentOptionContentItemSchema = z.object({
    paymentType: z.string().min(1, '支付类型不能为空'),
    paymentChannel: z.string().min(1, '支付渠道不能为空'),
    sort: z.number().optional(),
});

export type PaymentOptionContentItemReq = z.infer<typeof PaymentOptionContentItemSchema>;

export const PaymentOptionListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
});

export type PaymentOptionListReq = z.infer<typeof PaymentOptionListReqSchema>;

export const PaymentOptionAddReqSchema = z.object({
    name: z.string().min(1, '名称不能为空'),
    content: z.array(PaymentOptionContentItemSchema).default([]),
});

export type PaymentOptionAddReq = z.infer<typeof PaymentOptionAddReqSchema>;

export const PaymentOptionEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    name: z.string().min(1, '名称不能为空'),
    content: z.array(PaymentOptionContentItemSchema).default([]),
});

export type PaymentOptionEditReq = z.infer<typeof PaymentOptionEditReqSchema>;

export const PaymentOptionDeleteReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
});

export type PaymentOptionDeleteReq = z.infer<typeof PaymentOptionDeleteReqSchema>;

export const PaymentOptionItemsReqSchema = z.object({
    paymentOptionId: z.coerce.number().nonoptional(),
});

export type PaymentOptionItemsReq = z.infer<typeof PaymentOptionItemsReqSchema>;

export const PaymentOptionContentItemRespSchema = z.object({
    paymentType: z.string(),
    paymentChannel: z.string(),
    sort: z.number().optional(),
});

export type PaymentOptionContentItem = z.infer<typeof PaymentOptionContentItemRespSchema>;

export const PaymentOptionListRespItemSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});

export type PaymentOptionListRespItem = z.infer<typeof PaymentOptionListRespItemSchema>;

export const PaymentOptionListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(PaymentOptionListRespItemSchema),
});

export type PaymentOptionListResp = z.infer<typeof PaymentOptionListRespSchema>;
