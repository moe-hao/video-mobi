import z from "zod";

export const paymentOptionContentItemSchema = z.object({
    paymentType: z.string().min(1, '支付类型不能为空'),
    paymentChannel: z.string().min(1, '支付渠道不能为空'),
});

export const paymentOptionListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
});

export const paymentOptionAddReqSchema = z.object({
    name: z.string().min(1, '名称不能为空'),
    content: z.array(paymentOptionContentItemSchema).default([]),
});

export const paymentOptionEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    name: z.string().min(1, '名称不能为空'),
    content: z.array(paymentOptionContentItemSchema).default([]),
});

export const paymentOptionDeleteReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
});

export const paymentOptionItemsReqSchema = z.object({
    paymentOptionId: z.coerce.number().nonoptional(),
});
