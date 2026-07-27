import config from "@lib/internal/config";
import { AdAccount, AdsInsights, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { adReportDailyDao } from "@lib/repo/dao/ad-report-daily.dao";
import type { AdReportDailyInsert } from "@lib/repo/models/ad-report-daily";
import { logger } from "@lib/internal/logger";
import { tikTokBusinessProxy } from "@lib/repo/proxy/tiktok/business";
import { TikTokBusinessReportDataLevel, TikTokBusinessReportType } from "@lib/common/consts/tiktok";
import { PixelPlatform } from "@lib/common/consts/pixel";

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
    'act_1048291757636814',
    'act_1018077534480614',
];

const tikTokAdvertiserIds = [
    '7655256352845283346',
    '7657470291437928466',
    '7659353009683726343',
    '7659353613031505938',
    '7659353483266899975',
    '7659353483266965511',
    '7659353451559600135',
    '7666355755766874130',
    '7666077833304440839',
];

async function syncFacebookAdReport(date: string) {
    FacebookAdsApi.init(config.FbBusinessAccessToken);

    for (const adAccountId of adAccountIds) {
        logger.info(`syncAdReport: ${adAccountId} ${date}`);

        try {
            const adAccount = new AdAccount(adAccountId);
            const adAccountInfo = await adAccount.read([AdAccount.Fields.id, AdAccount.Fields.name]) as AdAccountInfo;

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
                    platform: PixelPlatform.Facebook,
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

/**
 * @name syncTikTokAdReport TikTok 广告报表 同步
 * @param date
 *
 * metrics:
 * advertiser_id: 广告账户id advertiser_name: 广告账户名称
 * campaign_id: 广告系列id campaign_name: 广告系列名称
 * adgroup_id: 广告组id adgroup_name: 广告组名称
 * ad_id_v2: 广告id ad_name: 广告名称
 * spend: 广告花费 conversion: 转化次数 cost_per_conversion: 平均转化成本
 * complete_payment_roas: 完成支付ROAS率
 * impressions: 展示次数 cpm: 每次展示成本 clicks: 点击次数 cpc: 每次点击成本 ctr: 点击率
 * video_views_p25: 视频播放进度 25% video_views_p50: 视频播放进度 50% video_views_p100: 视频播放进度 100%
 */
export async function syncTikTokAdReport(date: string) {
    const metrics = ['advertiser_id', 'advertiser_name', 'campaign_id', 'campaign_name', 'adgroup_id', 'adgroup_name', 'ad_id_v2', 'ad_name', 'spend', 'conversion', 'cost_per_conversion', 'complete_payment_roas', 'impressions', 'cpm', 'clicks', 'cpc', 'ctr', 'video_views_p25', 'video_views_p50', 'video_views_p100'];

    for (const advertiserId of tikTokAdvertiserIds) {
        logger.info(`syncTikTokAdReport: ${advertiserId} ${date}`);

        try {
            const shouldAddReportList: AdReportDailyInsert[] = [];
            let page = 1;
            let totalPages = 1;

            do {
                const result = await tikTokBusinessProxy.getReportDataByDate({
                    advertiser_id: advertiserId,
                    report_type: TikTokBusinessReportType.Basic,
                    data_level: TikTokBusinessReportDataLevel.AuctionAd,
                    dimensions: JSON.stringify(['ad_id_v2', 'country_code']),
                    metrics: JSON.stringify(metrics),
                    start_date: date,
                    end_date: date,
                    page,
                    page_size: 100,
                });

                if (result.code !== 0) {
                    logger.error(`syncTikTokAdReport: ${advertiserId} ${date} error: ${result.message}`);
                    continue;
                }

                const { page_info, list } = result.data;
                totalPages = page_info.total_page;
                logger.info(`syncTikTokAdReport: ${advertiserId} ${date} page ${page}/${totalPages}, count: ${list.length}`);

                for (const item of list) {
                    const adReportDailyDetail = await adReportDailyDao.getAdReportDailyByDateAndAdId(date, item.metrics.ad_id_v2, item.dimensions.country_code);

                    const adReportData: AdReportDailyInsert = {
                        platform: PixelPlatform.TikTok,
                        adAccountId: item.metrics.advertiser_id,
                        adAccountName: item.metrics.advertiser_name,
                        campaignId: item.metrics.campaign_id,
                        campaignName: item.metrics.campaign_name,
                        adsetId: item.metrics.adgroup_id,
                        adsetName: item.metrics.adgroup_name,
                        adId: item.metrics.ad_id_v2,
                        adName: item.metrics.ad_name,
                        region: item.dimensions.country_code,
                        spend: item.metrics.spend,
                        impressions: Number(item.metrics.impressions),
                        clicks: Number(item.metrics.clicks),
                        cpm: item.metrics.cpm,
                        cpc: item.metrics.cpc,
                        ctr: item.metrics.ctr,
                        purchaseRoas: item.metrics.complete_payment_roas,
                        purchasesConversionValue: item.metrics.conversion,
                        videoP25: Number(item.metrics.video_views_p25),
                        videoP50: Number(item.metrics.video_views_p50),
                        videoP100: Number(item.metrics.video_views_p100),
                    };

                    if (!adReportDailyDetail) {
                        adReportData.date = date;
                        shouldAddReportList.push(adReportData);
                    } else {
                        await adReportDailyDao.updateAdReportDaily(date, item.metrics.ad_id_v2, item.dimensions.country_code, adReportData);
                    }
                }

                page++;
            } while (page <= totalPages);

            if (shouldAddReportList.length > 0) {
                await adReportDailyDao.addAdReportDailyList(shouldAddReportList);
            }

            logger.info(`syncTikTokAdReport: ${advertiserId} ${date} completed, total: ${shouldAddReportList.length}`);
        } catch (error) {
            logger.error(`[Failed] syncTikTokAdReport: ${advertiserId} ${date} ${error}`);
        }
    }
}

function formatChinaDate(d: Date): string {
    return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' });
}

export const adReportDailyService = {
    asyncAdReportDaily: async () => {
        const today = formatChinaDate(new Date());
        await syncFacebookAdReport(today);
        await syncTikTokAdReport(today);
    },

    asyncAdReportYesterday: async () => {
        const yesterday = formatChinaDate(new Date(Date.now() - 86400000));
        await syncFacebookAdReport(yesterday);
        await syncTikTokAdReport(yesterday);
    },

    asyncAdReportWeek: async () => {
        const week = formatChinaDate(new Date(Date.now() - 8 * 86400000));
        await syncFacebookAdReport(week);
        await syncTikTokAdReport(week);
    }
}
