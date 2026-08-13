import type { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { orderDao } from "@lib/repo/dao/order.dao";
import { subscriptionRenewalReportDao } from "@lib/repo/dao/subscription-renewal-report.dao";

export async function statRenewalReport(date: string) {
    const sTime = Math.floor(new Date(`${date}T00:00:00+08:00`).getTime() / 1000);
    const eTime = Math.floor(new Date(`${date}T23:59:59+08:00`).getTime() / 1000);

    const orderList = await orderDao.getSubscriptionOrderListByTimeRange(sTime, eTime);
    for (const orderInfo of orderList) {
        const userSubscriptionOrderList = await orderDao.getOrderCountByUserIdAndSubscriptionId(orderInfo.userId, orderInfo.subscriptionId, eTime);
        const periodNum = userSubscriptionOrderList.length;

        const reportInfo = await subscriptionRenewalReportDao.getReportInfo(date, orderInfo.productId, orderInfo.paymentChannel as PaymentChannel, orderInfo.paymentType as PaymentType, periodNum);
        if (reportInfo) {
            await subscriptionRenewalReportDao.updateReportDataById(reportInfo.id, { subscriptionNum: reportInfo.subscriptionNum + 1 });
        } else {
            await subscriptionRenewalReportDao.addNewReportData({
                date: date,
                productId: orderInfo.productId,
                paymentChannel: orderInfo.paymentChannel as PaymentChannel,
                paymentType: orderInfo.paymentType as PaymentType,
                periodNum: periodNum,
                subscriptionNum: 1,
            });
        }
    }
}
