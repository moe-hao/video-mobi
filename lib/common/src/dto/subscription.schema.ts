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

export const SubscriptionCancelReqSchema = z.object({
    subscriptionId: z.number().int(),
});

export type SubscriptionListReq = z.infer<typeof SubscriptionListReqSchema>;
export type SubscriptionCancelReq = z.infer<typeof SubscriptionCancelReqSchema>;

export interface SubscriptionListResp {
    page: number;
    size: number;
    total: number;
    list: SubscriptionListRespItem[];
}

export interface SubscriptionListRespItem {
    id: number;
    userId: number;
    subscriptionChannel: string;
    subscriptionNo: string;
    subscriptionStatus: number;
    subscriptionStatusName: string;
    createTime: string;
    updateTime: string;
}
