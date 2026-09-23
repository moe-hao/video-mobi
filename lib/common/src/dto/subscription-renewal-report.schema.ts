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

export const SubscriptionRenewalReportListRespItemSchema = z.object({
    periodNum: z.number().int(),
    subscriptionNum: z.number().int(),
    renewalRate: z.string(),
});

export type SubscriptionRenewalReportListRespItem = z.infer<typeof SubscriptionRenewalReportListRespItemSchema>;

export const SubscriptionRenewalReportListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(SubscriptionRenewalReportListRespItemSchema),
});

export type SubscriptionRenewalReportListResp = z.infer<typeof SubscriptionRenewalReportListRespSchema>;
