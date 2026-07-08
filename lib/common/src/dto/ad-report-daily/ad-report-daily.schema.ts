import z from "zod";

export const adReportDailyListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    date: z.string().default(''),
    adAccountId: z.string().default(''),
    campaignId: z.string().default(''),
    adId: z.string().default(''),
});

export type AdReportDailyListReq = z.infer<typeof adReportDailyListReqSchema>;
