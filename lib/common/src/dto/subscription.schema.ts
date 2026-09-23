import z from "zod";

export const SubscriptionListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    status: z.string().default('').or(z.coerce.number().int()),
    subscriptionNo: z.string().default(''),
    userId: z.string().default(''),
    channel: z.string().default(''),
    startDate: z.string().default(''),
    endDate: z.string().default(''),
});

export type SubscriptionListReq = z.infer<typeof SubscriptionListReqSchema>;

export const SubscriptionCancelReqSchema = z.object({
    subscriptionId: z.number().int(),
});

export type SubscriptionCancelReq = z.infer<typeof SubscriptionCancelReqSchema>;

export const SubscriptionListRespItemSchema = z.object({
    id: z.number().int(),
    userId: z.number().int(),
    subscriptionChannel: z.string(),
    subscriptionNo: z.string(),
    subscriptionStatus: z.number().int(),
    subscriptionStatusName: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});

export type SubscriptionListRespItem = z.infer<typeof SubscriptionListRespItemSchema>;

export const SubscriptionListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(SubscriptionListRespItemSchema),
});

export type SubscriptionListResp = z.infer<typeof SubscriptionListRespSchema>;
