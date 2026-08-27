import type { LtvReportListReq, LtvReportListResp, LtvReportListItem } from "@lib/common/dto/ltv-report";
import { ltvReportDao, type LtvReportListSearch } from "@lib/repo/dao/ltv-report.dao";
import type { LtvReportSelect } from "@lib/repo/models/ltv-report";

type GroupKey = string;

function buildGroupKey(item: LtvReportSelect): GroupKey {
    return `${item.startDate}|${item.productId}|${item.paymentChannel}|${item.paymentType}`;
}

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
        productId: req.productId,
        paymentChannel: req.paymentChannel,
        paymentType: req.paymentType,
    };

    const rows = await ltvReportDao.getLtvReportList(search);

    const groupMap = new Map<GroupKey, LtvReportSelect[]>();
    for (const row of rows) {
        const key = buildGroupKey(row);
        if (!groupMap.has(key)) {
            groupMap.set(key, []);
        }
        groupMap.get(key)!.push(row);
    }

    const allItems: LtvReportListItem[] = [];
    for (const [key, groupRows] of groupMap) {
        const [startDate, productId, paymentChannel, paymentType] = key.split('|');
        const cumMap = computeCumulativeIncome(groupRows);
        allItems.push({
            startDate,
            productId: Number(productId),
            paymentChannel,
            paymentType,
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

    allItems.sort((a, b) => {
        if (a.startDate !== b.startDate) return b.startDate.localeCompare(a.startDate);
        if (a.productId !== b.productId) return a.productId - b.productId;
        if (a.paymentChannel !== b.paymentChannel) return a.paymentChannel.localeCompare(b.paymentChannel);
        return a.paymentType.localeCompare(b.paymentType);
    });

    const total = allItems.length;
    const start = (req.page - 1) * req.size;
    const list = allItems.slice(start, start + req.size);

    return {
        page: req.page,
        size: req.size,
        total,
        list,
    };
}
