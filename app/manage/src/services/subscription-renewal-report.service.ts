import type { SubscriptionRenewalReportListReq, SubscriptionRenewalReportListResp } from "@lib/common/dto/subscription-renewal-report";
import { subscriptionRenewalReportDao } from "@lib/repo/dao/subscription-renewal-report.dao";

export async function getSubscriptionRenewalReportList(req: SubscriptionRenewalReportListReq): Promise<SubscriptionRenewalReportListResp> {
    const search = {
        date: req.date ?? '',
        productIds: req.productIds ?? '',
        paymentChannel: req.paymentChannel ?? '',
        paymentType: req.paymentType ?? '',
        periodType: req.periodType ?? '',
    };

    const [list, total] = await Promise.all([
        subscriptionRenewalReportDao.getListPage(req.page, req.size, search),
        subscriptionRenewalReportDao.getListTotal(search),
    ]);

    const prevItem = req.page > 1
        ? await subscriptionRenewalReportDao.getListAtOffset(search, (req.page - 1) * req.size - 1)
        : undefined;

    return {
        page: req.page,
        size: req.size,
        total,
        list: list.map((item, index) => {
            const subscriptionNum = Number(item.subscriptionNum);
            const prevNum = index > 0 ? Number(list[index - 1].subscriptionNum) : (prevItem?.subscriptionNum ?? 0);
            const renewalRate = prevNum > 0 ? (subscriptionNum / prevNum * 100).toFixed(2) + '%' : '-';
            return {
                periodNum: Number(item.periodNum),
                subscriptionNum,
                renewalRate,
            };
        }),
    };
}
