import z from "zod";

export const SubscriptionRenewalReportListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    date: z.string().default(''),
    productIds: z.string().default(''),
    paymentChannel: z.string().default(''),
    paymentType: z.string().default(''),
    periodType: z.string().default(''),
});

export type SubscriptionRenewalReportListReq = z.infer<typeof SubscriptionRenewalReportListReqSchema>;

export interface SubscriptionRenewalReportListResp {
    page: number;
    size: number;
    total: number;
    list: SubscriptionRenewalReportListRespItem[];
}

export interface SubscriptionRenewalReportListRespItem {
    periodNum: number;
    subscriptionNum: number;
    renewalRate: string;
}
