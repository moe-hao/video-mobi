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
    ad_id: string;
    adset_id: string;
    campaign_id: string;
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

