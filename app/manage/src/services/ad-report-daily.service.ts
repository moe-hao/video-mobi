import type { AdReportDailyListReq, AdReportDailyListResp, AdReportDailySummaryResp, AdReportDailyGroupResp } from "@lib/common/dto/ad-report-daily";
import { adReportDailyDao } from "@lib/repo/dao/ad-report-daily.dao";
import { formatUnixTime } from "@lib/common/utils/time";
import { Region, RegionName } from "@lib/common/consts/region";

class AdReportDailyService {
    async getAdReportDailyList(req: AdReportDailyListReq): Promise<AdReportDailyListResp> {
        const search = {
            date: req.date ?? '',
            platform: req.platform ?? '',
            adAccountId: req.adAccountId ?? '',
            campaignId: req.campaignId ?? '',
            adId: req.adId ?? '',
            region: req.region ?? '',
        };

        const [list, total] = await Promise.all([
            adReportDailyDao.getAdReportDailyListPage(req.page, req.size, search, req.sortField, req.sortDir),
            adReportDailyDao.getAdReportDailyListTotal(search),
        ]);

        return {
            page: req.page,
            size: req.size,
            total: total.count,
            sumSpend: Number(total.spend),
            sumPurchasesConversionValue: Number(total.purchasesConversionValue),
            sumPurchaseConversionCount: total.purchaseConversionCount,
            list: list.map((item) => ({
                ...item,
                region: RegionName[item.region as Region] || item.region,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    }

    async getAdReportDailySummary(date: string, platform?: string): Promise<AdReportDailySummaryResp> {
        const result = await adReportDailyDao.getAdReportDailySummary(date, platform);
        return {
            spend: result.spend ?? '0',
            purchasesConversionValue: result.purchasesConversionValue ?? '0',
            purchaseRoas: result.spend && Number(result.spend) !== 0 ? (Number(result.purchasesConversionValue) / Number(result.spend) * 100).toFixed(2) + '%' : '0',
            purchaseConversionCount: Number(result.purchaseConversionCount ?? 0),
        };
    }

    async getAdReportDailyGroup(search: { start: string; end: string; country: string; platform: number; page: number; size: number }): Promise<AdReportDailyGroupResp> {
        const [list, total, summary] = await Promise.all([
            adReportDailyDao.getAdReportDailyGroup(search.start, search.end, search.country, search.platform, search.page, search.size),
            adReportDailyDao.getAdReportDailyGroupTotal(search.start, search.end, search.country, search.platform),
            adReportDailyDao.getAdReportDailyGroupSummary(search.start, search.end, search.country, search.platform),
        ]);
        return { page: search.page, size: search.size, total, summary, list };
    }
}

export const adReportDailyService = new AdReportDailyService();
