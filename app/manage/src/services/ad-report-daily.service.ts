import type { AdReportDailyListReq, AdReportDailyListResp, AdReportDailySummaryResp } from "@lib/common/dto/ad-report-daily";
import { adReportDailyDao } from "@lib/repo/dao/ad-report-daily.dao";
import { formatUnixTime } from "@lib/common/utils/time";
import { Region, RegionName } from "@lib/common/consts/region";

class AdReportDailyService {
    async getAdReportDailyList(req: AdReportDailyListReq): Promise<AdReportDailyListResp> {
        const search = {
            date: req.date ?? '',
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
            list: list.map((item) => ({
                ...item,
                region: RegionName[item.region as Region] || '',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    }

    async getAdReportDailySummary(date: string): Promise<AdReportDailySummaryResp> {
        const result = await adReportDailyDao.getAdReportDailySummary(date);
        return {
            spend: result.spend ?? '0',
            purchasesConversionValue: result.purchasesConversionValue ?? '0',
            purchaseRoas: result.spend && Number(result.spend) !== 0 ? (Number(result.purchasesConversionValue) / Number(result.spend) * 100).toFixed(2) + '%' : '0',
        };
    }
}

export const adReportDailyService = new AdReportDailyService();
