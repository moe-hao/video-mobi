export interface FacebookEventReq {
    access_token: string;
    data: FacebookEventData[];
}

export interface FacebookEventData {
    event_name: string;
    event_time: number;
    attribution_data: FacebookEventAttributionData;
    user_data: FacebookEventUserData,
    custom_data: FacebookEventCustomData,
}

export interface FacebookEventAttributionData {
    ad_id: string; // 广告id
    adset_id: string; // 广告组id
    campaign_id: string; // 广告系列id
}

export interface FacebookEventUserData {
    app_user_id: string;
}

export interface FacebookEventCustomData {
    value: number;
    currency: string;
}

export interface FacebookEventActionData {
    action_source: string;
}

export interface AdParam {
    ad_id: string; // 广告id
    adset_id: string; // 广告组id
    campaign_id: string; // 广告系列id
    fbclid: string;
}
