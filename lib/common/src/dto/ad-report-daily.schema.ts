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

export const AdReportDailySummaryReqSchema = z.object({
    date: z.string().default(''),
    platform: z.string().default(''),
});

export const AdReportDailyGroupReqSchema = z.object({
    start: z.string(),
    end: z.string(),
    country: z.string().default(''),
    platform: z.coerce.number().int(),
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
});

export type AdReportDailyListReq = z.infer<typeof AdReportDailyListReqSchema>;
export type AdReportDailySummaryReq = z.infer<typeof AdReportDailySummaryReqSchema>;
export type AdReportDailyGroupReq = z.infer<typeof AdReportDailyGroupReqSchema>;

export interface AdReportDailyListResp {
    page: number;
    size: number;
    total: number;
    sumSpend: number;
    sumPurchasesConversionValue: number;
    sumPurchaseConversionCount: number;
    list: AdReportDailyListRespItem[];
}

export interface AdReportDailyListRespItem {
    id: number;
    date: string;
    platform: number;
    adAccountId: string;
    adAccountName: string;
    campaignId: string;
    campaignName: string;
    adsetId: string;
    adsetName: string;
    adId: string;
    adName: string;
    region: string;
    spend: string;
    impressions: number;
    cpm: string;
    clicksNum: number;
    cpc: string;
    ctr: string;
    purchasesConversionValue: string;
    purchaseConversionCount: number;
    purchaseRoas: string;
    videoP25: number;
    videoP50: number;
    videoP100: number;
    createTime: string;
    updateTime: string;
}

export interface AdReportDailySummaryResp {
    spend: string;
    purchasesConversionValue: string;
    purchaseRoas: string;
    purchaseConversionCount: number;
}

export interface AdReportDailyGroupResp {
    page: number;
    size: number;
    total: number;
    summary: {
        spendSum: number;
        purchaseConversionCountSum: number;
        purchasesConversionValueSum: number;
        impressionsSum: number;
        clicksNumSum: number;
    };
    list: {
        date: string;
        region: string;
        spendSum: number;
        purchaseConversionCountSum: number;
        purchasesConversionValueSum: number;
        impressionsSum: number;
        clicksNumSum: number;
    }[];
}
