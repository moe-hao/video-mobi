import type { PixelEvent } from "@lib/common/consts/pixel";
import type { TikTokBusinessReportDataLevel, TikTokBusinessReportType } from "@lib/common/consts/tiktok";

export interface TikTokBusinessEventReq {
    event_source: string;
    event_source_id: string;
    data: TikTokBusinessEventData[];
}

export interface TikTokBusinessEventData {
    event: PixelEvent;
    event_time: number;
    event_id: string;
    user: TikTokBusinessEventUserData;
    properties: TikTokBusinessEventProperties;
    page: TikTokBusinessEventPage;
}

export interface TikTokBusinessEventUserData {
    external_id: string;
    ttclid: string;
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

export interface TikTokBusinessReportReq {
    advertiser_id: string;
    report_type: TikTokBusinessReportType;
    data_level: TikTokBusinessReportDataLevel;
    dimensions: string[];
    start_date: string;
    end_date: string;
    page: number;
    page_size: number;
}

export interface TikTokBusinessReportResp {
    code: number;
    message: string;
    data: TikTokBusinessReportRespData
}

export interface TikTokBusinessReportRespData {
    page_info: {
        page: number;
        page_size: number;
        total_page: number;
        total_number: number;
    },
    list: TikTokBusinessReportRespDataListItem[]
}

export interface TikTokBusinessReportRespDataListItem {

}
