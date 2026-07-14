import z from "zod";

export const adReportDailyListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    date: z.string().default(''),
    adAccountId: z.string().default(''),
    campaignId: z.string().default(''),
    adId: z.string().default(''),
    sortField: z.enum(['spend', 'purchasesConversionValue', '']).default(''),
    sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export const adReportDailySummaryReqSchema = z.object({
    date: z.string().default(''),
});


export type AdReportDailyListReq = z.infer<typeof adReportDailyListReqSchema>;
export type AdReportDailySummaryReq = z.infer<typeof adReportDailySummaryReqSchema>;
