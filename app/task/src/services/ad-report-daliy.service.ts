import config from "@lib/internal/config";
import { AdAccount, AdsInsights, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { adReportDailyDao } from "@lib/repo/dao/ad-report-daily.dao";
import type { AdReportDailyInsert } from "@lib/repo/models/ad-report-daily";

const fields = [
    AdsInsights.Fields.campaign_id, // 广告系列id
    AdsInsights.Fields.campaign_name, // 广告系列名称
    AdsInsights.Fields.adset_id, // 广告组id
    AdsInsights.Fields.adset_name, // 广告组名称
    AdsInsights.Fields.ad_id, // 广告id
    AdsInsights.Fields.ad_name, // 广告名称
    // AdsInsights.Breakdowns.country, // 国家
    AdsInsights.Fields.spend, // 花费
    AdsInsights.Fields.conversion_values, // 购物次数
    AdsInsights.Fields.impressions, // 展示量
    AdsInsights.Fields.clicks, // 点击量
    AdsInsights.Fields.cpm, // 千次点击费用
    AdsInsights.Fields.inline_link_clicks, // 链接点击量
    AdsInsights.Fields.cpc, // 单次点击费用
    AdsInsights.Fields.ctr, // 点击率
    AdsInsights.Fields.video_p25_watched_actions, // 视频播放进度 25%
    AdsInsights.Fields.video_p50_watched_actions, // 视频播放进度 50%
    AdsInsights.Fields.video_p100_watched_actions, // 视频播放进度 100%
];

type AdAccountInfo = {
    id: string;
    name: string;
}

export const adReportDailyService = {
    asyncAdReportDaily: async () => {
        FacebookAdsApi.init(config.FbBusinessAccessToken);
        const adAccount = new AdAccount('act_1333081838411463');
        const adAccountInfo = await adAccount.read([AdAccount.Fields.id, AdAccount.Fields.name]) as AdAccountInfo;

        const today = new Date().toISOString().split('T')[0];
        const insightsParam = {
            time_range: { since: today, until: today },
            level: 'ad',
        }


        const insights = await adAccount.getInsights(fields, insightsParam);
        const shouldAddReportList: AdReportDailyInsert[] = [];

        for (const item of insights) {
            const adReportDailyDetail = await adReportDailyDao.getAdReportDailyByDateAndAdId(today, item.ad_id);
            if (!adReportDailyDetail) {
                shouldAddReportList.push({
                    date: today,
                    ad_account_name: adAccountInfo.name,
                    ad_id: item.ad_id,
                    ad_name: item.ad_name,
                    adset_id: item.adset_id,
                    adset_name: item.adset_name,
                    campaign_id: item.campaign_id,
                    campaign_name: item.campaign_name,
                    clicks: item.clicks,
                    cpc: item.cpc,
                    cpm: item.cpm,
                    ctr: item.ctr,
                    impressions: item.impressions,
                    spend: item.spend,
                    video_p25: item.video_p25_watched_actions?.[0]?.value,
                    video_p50: item.video_p50_watched_actions?.[0]?.value,
                    video_p100: item.video_p100_watched_actions?.[0]?.value,
                });
            } else {
                await adReportDailyDao.updateAdReportDaily(today, item.ad_id, {
                    ad_account_name: adAccountInfo.name,
                    ad_id: item.ad_id,
                    ad_name: item.ad_name,
                    adset_id: item.adset_id,
                    adset_name: item.adset_name,
                    campaign_id: item.campaign_id,
                    campaign_name: item.campaign_name,
                    clicks: item.clicks,
                    cpc: item.cpc,
                    cpm: item.cpm,
                    ctr: item.ctr,
                    impressions: item.impressions,
                    spend: item.spend,
                    video_p25: item.video_p25_watched_actions?.[0]?.value,
                    video_p50: item.video_p50_watched_actions?.[0]?.value,
                    video_p100: item.video_p100_watched_actions?.[0]?.value,
                });
            }
        }

        if (shouldAddReportList.length > 0) {
            await adReportDailyDao.addAdReportDailyList(shouldAddReportList);
        }
    }
}
