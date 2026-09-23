import z from "zod";

export const AdReportDailyListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    date: z.string().default(''),
    platform: z.string().default(''),
    adAccountId: z.string().default(''),
    campaignId: z.string().default(''),
    adId: z.string().default(''),
    region: z.string().default(''),
    sortField: z.enum(['spend', 'purchasesConversionValue', '']).default(''),
    sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export type AdReportDailyListReq = z.infer<typeof AdReportDailyListReqSchema>;

export const AdReportDailySummaryReqSchema = z.object({
    date: z.string().default(''),
    platform: z.string().default(''),
});

export type AdReportDailySummaryReq = z.infer<typeof AdReportDailySummaryReqSchema>;

export const AdReportDailyGroupReqSchema = z.object({
    start: z.string(),
    end: z.string(),
    country: z.string().default(''),
    platform: z.coerce.number().int(),
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
});

export type AdReportDailyGroupReq = z.infer<typeof AdReportDailyGroupReqSchema>;

export const AdReportDailyListRespItemSchema = z.object({
    id: z.number().int(),
    date: z.string(),
    platform: z.number().int(),
    adAccountId: z.string(),
    adAccountName: z.string(),
    campaignId: z.string(),
    campaignName: z.string(),
    adsetId: z.string(),
    adsetName: z.string(),
    adId: z.string(),
    adName: z.string(),
    region: z.string(),
    spend: z.string(),
    impressions: z.number().int(),
    cpm: z.string(),
    clicksNum: z.number().int(),
    cpc: z.string(),
    ctr: z.string(),
    purchasesConversionValue: z.string(),
    purchaseConversionCount: z.number().int(),
    purchaseRoas: z.string(),
    videoP25: z.number().int(),
    videoP50: z.number().int(),
    videoP100: z.number().int(),
    createTime: z.string(),
    updateTime: z.string(),
});

export type AdReportDailyListRespItem = z.infer<typeof AdReportDailyListRespItemSchema>;

export const AdReportDailyListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    sumSpend: z.number(),
    sumPurchasesConversionValue: z.number(),
    sumPurchaseConversionCount: z.number().int(),
    list: z.array(AdReportDailyListRespItemSchema),
});

export type AdReportDailyListResp = z.infer<typeof AdReportDailyListRespSchema>;

export const AdReportDailySummaryRespSchema = z.object({
    spend: z.string(),
    purchasesConversionValue: z.string(),
    purchaseRoas: z.string(),
    purchaseConversionCount: z.number().int(),
});

export type AdReportDailySummaryResp = z.infer<typeof AdReportDailySummaryRespSchema>;

export const AdReportDailyGroupSummarySchema = z.object({
    spendSum: z.number(),
    purchaseConversionCountSum: z.number().int(),
    purchasesConversionValueSum: z.number(),
    impressionsSum: z.number().int(),
    clicksNumSum: z.number().int(),
});

export const AdReportDailyGroupItemSchema = z.object({
    date: z.string(),
    region: z.string(),
    spendSum: z.number(),
    purchaseConversionCountSum: z.number().int(),
    purchasesConversionValueSum: z.number(),
    impressionsSum: z.number().int(),
    clicksNumSum: z.number().int(),
});

export const AdReportDailyGroupRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    summary: AdReportDailyGroupSummarySchema,
    list: z.array(AdReportDailyGroupItemSchema),
});

export type AdReportDailyGroupResp = z.infer<typeof AdReportDailyGroupRespSchema>;
