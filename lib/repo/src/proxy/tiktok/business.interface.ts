import type { TikTokEvent } from "@lib/common/consts/pixel";

export interface TikTokBusinessEventReq {
    event_source: string;
    event_source_id: string;
    data: TikTokBusinessEventData[];
}

export interface TikTokBusinessEventData {
    event: TikTokEvent;
    event_time: number;
    event_id: string;
    user: TikTokBusinessEventUserData;
    properties: TikTokBusinessEventProperties;
    page: TikTokBusinessEventPage;
}

export interface TikTokBusinessEventUserData {
    external_id: string;
}

export interface TikTokBusinessEventProperties {
    content_ids: string[];
    currency: string;
    value: number;
}

export interface TikTokBusinessEventPage {
    url: string;
}

export interface TikTokBusinessEventAd {
    creative_id: string; // 广告id
    ad_id: string; // 广告组id
    campaign_id: string; // 广告系列id
}
