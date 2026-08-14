import z from "zod";

export const subscriptionRenewalReportListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    date: z.string().default(''),
    productIds: z.string().default(''),
    paymentChannel: z.string().default(''),
    paymentType: z.string().default(''),
    periodType: z.string().default(''),
});

export type SubscriptionRenewalReportListReq = z.infer<typeof subscriptionRenewalReportListReqSchema>;
