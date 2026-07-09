export interface AdReportDailyListResp {
    page: number;
    size: number;
    total: number;
    list: AdReportDailyListRespItem[];
}

export interface AdReportDailyListRespItem {
    id: number;
    date: string;
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
    videoP25: number;
    videoP50: number;
    videoP100: number;
    createTime: string;
    updateTime: string;
}
