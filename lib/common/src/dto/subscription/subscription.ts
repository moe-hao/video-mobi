export interface SubscriptionDetailResp {
    isCanceled: boolean;
}

export interface SubscriptionListResp {
    page: number;
    size: number;
    total: number;
    list: SubscriptionListRespItem[];
}

export interface SubscriptionListRespItem {
    id: number;
    userInfo: string;
    subscriptionNo: string;
    subscriptionStatus: number;
    subscriptionStatusName: string;
    createTime: string;
    updateTime: string;
}

