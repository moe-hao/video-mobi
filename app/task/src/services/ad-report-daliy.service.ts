import config from "@lib/internal/config";
import { AdAccount, AdsInsights, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { adReportDailyDao } from "@lib/repo/dao/ad-report-daily.dao";
import type { AdReportDailyInsert } from "@lib/repo/models/ad-report-daily";
import { logger } from "@lib/internal/logger";

const fields = [
    AdsInsights.Fields.campaign_id, // 广告系列id
    AdsInsights.Fields.campaign_name, // 广告系列名称
    AdsInsights.Fields.adset_id, // 广告组id
    AdsInsights.Fields.adset_name, // 广告组名称
    AdsInsights.Fields.ad_id, // 广告id
    AdsInsights.Fields.ad_name, // 广告名称
    AdsInsights.Fields.spend, // 花费
    AdsInsights.Fields.impressions, // 展示量
    AdsInsights.Fields.clicks, // 点击量
    AdsInsights.Fields.cpm, // 千次点击费用
    AdsInsights.Fields.inline_link_clicks, // 链接点击量
    AdsInsights.Fields.cpc, // 单次点击费用
    AdsInsights.Fields.ctr, // 点击率
    AdsInsights.Fields.video_p25_watched_actions, // 视频播放进度 25%
    AdsInsights.Fields.video_p50_watched_actions, // 视频播放进度 50%
    AdsInsights.Fields.video_p100_watched_actions, // 视频播放进度 100%
    AdsInsights.Fields.purchase_roas, // 购物ROAS率
    AdsInsights.Fields.action_values, // 转化价值
];

type AdAccountInfo = {
    id: string;
    name: string;
}

const adAccountIds = [
    'act_1494926801789646',
    'act_1332894538253659',
    'act_1333081838411463',
    'act_2240955640039618',
    'act_2293389774821206',
    'act_1343768931195456',
    'act_1318458003326846',
    'act_2254515465088685',
    'act_1398471105534892',
];

async function syncAdReport(date: string) {
    FacebookAdsApi.init(config.FbBusinessAccessToken);

    for (const adAccountId of adAccountIds) {
        logger.info(`syncAdReport: ${adAccountId} ${date}`);

        try {
            const adAccount = new AdAccount(adAccountId);
            const adAccountInfo = await adAccount.read([AdAccount.Fields.id, AdAccount.Fields.name]) as AdAccountInfo;
            logger.info(`syncAdReport: ${adAccountId} ${date}------`);

            const insightsParam = {
                time_range: { since: date, until: date },
                level: 'ad',
                breakdowns: ['country'],
            }

            const insights: any[] = [];
            let cursor = await adAccount.getInsights(fields, { ...insightsParam, limit: 500 });
            insights.push(...cursor);
            while (cursor.hasNext()) {
                cursor = await cursor.next();
                insights.push(...cursor);
            }
            logger.info(`syncAdReport: ${adAccountId} ${date} insights count: ${insights.length}`);
            const shouldAddReportList: AdReportDailyInsert[] = [];

            for (const item of insights) {
                const adReportDailyDetail = await adReportDailyDao.getAdReportDailyByDateAndAdId(date, item.ad_id, item.country);
                const adReportData: AdReportDailyInsert = {
                    adAccountId: adAccountInfo.id,
                    adAccountName: adAccountInfo.name,
                    campaignId: item.campaign_id,
                    campaignName: item.campaign_name,
                    adsetId: item.adset_id,
                    adsetName: item.adset_name,
                    adId: item.ad_id,
                    adName: item.ad_name,
                    region: item.country,
                    clicksNum: item.inline_link_clicks,
                    cpc: item.cpc,
                    cpm: item.cpm,
                    ctr: item.ctr,
                    impressions: item.impressions,
                    spend: item.spend,
                    purchaseRoas: item.purchase_roas?.[0]?.value,
                    purchasesConversionValue: item.action_values?.find((v: any) => v.action_type === 'purchase')?.value,
                    videoP25: item.video_p25_watched_actions?.[0]?.value,
                    videoP50: item.video_p50_watched_actions?.[0]?.value,
                    videoP100: item.video_p100_watched_actions?.[0]?.value,
                };
                logger.info(adReportData);

                if (!adReportDailyDetail) {
                    adReportData.date = date;
                    shouldAddReportList.push(adReportData);
                } else {
                    await adReportDailyDao.updateAdReportDaily(date, item.ad_id, item.country, adReportData);
                }
            }

            if (shouldAddReportList.length > 0) {
                await adReportDailyDao.addAdReportDailyList(shouldAddReportList);
            }
        } catch (error) {
            logger.error(`[Failed] ${error}`);
        }
    }
}

function formatChinaDate(d: Date): string {
    return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' });
}

export const adReportDailyService = {
    asyncAdReportDaily: async () => {
        const today = formatChinaDate(new Date());
        await syncAdReport(today);
    },

    asyncAdReportYesterday: async () => {
        const yesterday = formatChinaDate(new Date(Date.now() - 86400000));
        await syncAdReport(yesterday);
    },

    asyncAdReportWeek: async () => {
        const week = formatChinaDate(new Date(Date.now() - 8 * 86400000));
        await syncAdReport(week);
    }

}
