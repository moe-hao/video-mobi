import type { LtvReportListReq, LtvReportListResp, LtvReportListItem } from "@lib/common/dto/ltv-report";
import { ltvReportDao, type LtvReportListSearch } from "@lib/repo/dao/ltv-report.dao";
import type { LtvReportSelect } from "@lib/repo/models/ltv-report";
import { adReportDailyDao } from "@lib/repo/dao/ad-report-daily.dao";

function computeCumulativeIncome(rows: LtvReportSelect[]): Map<number, string> {
    const sorted = [...rows].sort((a, b) => a.day - b.day);
    const cumMap = new Map<number, string>();
    let cumIncome = 0;
    for (const row of sorted) {
        cumIncome += Number(row.income);
        cumMap.set(row.day, cumIncome.toFixed(2));
    }
    return cumMap;
}

export async function getLtvReportList(req: LtvReportListReq): Promise<LtvReportListResp> {
    const search: LtvReportListSearch = {
        startDateBegin: req.startDateBegin,
        startDateEnd: req.startDateEnd,
        productIds: req.productIds,
        paymentChannel: req.paymentChannel,
        paymentType: req.paymentType,
    };

    const rows = await ltvReportDao.getLtvReportList(search);

    // 按 startDate 分组，聚合所有 productId/paymentChannel/paymentType 的数据
    const groupMap = new Map<string, LtvReportSelect[]>();
    for (const row of rows) {
        const key = row.startDate;
        if (!groupMap.has(key)) {
            groupMap.set(key, []);
        }
        groupMap.get(key)!.push(row);
    }

    const allItems: LtvReportListItem[] = [];
    for (const [startDate, groupRows] of groupMap) {
        // 合并同一天的收入，再计算累计
        const dayIncomeMap = new Map<number, number>();
        for (const row of groupRows) {
            dayIncomeMap.set(row.day, (dayIncomeMap.get(row.day) ?? 0) + Number(row.income));
        }
        const mergedRows: LtvReportSelect[] = [];
        for (const [day, income] of dayIncomeMap) {
            mergedRows.push({ ...groupRows[0], day, income: income.toFixed(2) });
        }
        const cumMap = computeCumulativeIncome(mergedRows);
        allItems.push({
            startDate,
            spend: '0.00',
            d0Income: cumMap.get(0) ?? '0.00',
            d7Income: cumMap.get(7) ?? '0.00',
            d14Income: cumMap.get(14) ?? '0.00',
            d21Income: cumMap.get(21) ?? '0.00',
            d28Income: cumMap.get(28) ?? '0.00',
            d35Income: cumMap.get(35) ?? '0.00',
            d42Income: cumMap.get(42) ?? '0.00',
            d49Income: cumMap.get(49) ?? '0.00',
            d56Income: cumMap.get(56) ?? '0.00',
        });
    }

    allItems.sort((a, b) => b.startDate.localeCompare(a.startDate));

    const total = allItems.length;
    const start = (req.page - 1) * req.size;
    const list = allItems.slice(start, start + req.size);

    // 查询当日消耗
    const dateList = list.map((item) => item.startDate);
    const spendMap = await adReportDailyDao.getSpendByDates(dateList);

    return {
        page: req.page,
        size: req.size,
        total,
        list: list.map(item => ({
            ...item,
            spend: Number(spendMap.get(item.startDate) ?? 0).toFixed(2),
        })),
    };
}
