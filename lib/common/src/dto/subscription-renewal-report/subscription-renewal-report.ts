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
