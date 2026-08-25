import { OrderStatus } from '@lib/common/consts/order';
import { orderDao } from '@lib/repo/dao/order.dao';
import { userDao } from '@lib/repo/dao/user.dao';
import type { UserSelect } from '@lib/repo/models/user';
import { startOfDay, endOfDay, parseISO, differenceInDays, fromUnixTime } from 'date-fns';
import { ltvReportDao } from '@lib/repo/dao/ltv-report.dao';
import { ltvReportItemDao } from '@lib/repo/dao/ltv-report-item.dao';

export async function calculateLTtvReport(date: string) {
    const day = parseISO(date);
    const sTime = Math.floor(startOfDay(day).getTime() / 1000);
    const eTime = Math.floor(endOfDay(day).getTime() / 1000);

    const orderList = await orderDao.getOrderListByTimeRange(OrderStatus.Completed, sTime, eTime);
    console.log(orderList);
    const userIds = orderList.map((item) => item.userId);
    const userList = await userDao.getUserListByIds(userIds);
    const userIdMap = userList.reduce((prev, cur) => {
        prev.set(cur.id, cur);
        return prev;
    }, new Map<number, UserSelect>());

    for (const orderInfo of orderList) {
        const userInfo = userIdMap.get(orderInfo.userId);
        if (userInfo) {
            const days = differenceInDays(startOfDay(day), startOfDay(fromUnixTime(userInfo.createTime)));
            const week = Math.floor(days / 7) + 1;

            const ltvReport = await ltvReportDao.getReport({
                date: date,
                productId: orderInfo.productId,
                paymentChannel: orderInfo.paymentChannel,
                paymentType: orderInfo.paymentType,
            });

            let reportId = 0;
            if (!ltvReport) {
                reportId = await ltvReportDao.insertReport({
                    date: date,
                    productId: orderInfo.productId,
                    paymentChannel: orderInfo.paymentChannel,
                    paymentType: orderInfo.paymentType,
                });
            } else {
                reportId = ltvReport.id;
            }

            const ltvReportItem = await ltvReportItemDao.getReportItemByReportIdAndWeek(reportId, week);
            if (!ltvReportItem) {
                ltvReportItemDao.insertReportItem({
                    ltvReportId: reportId,
                    week: week,
                    cost: '0.00',
                    income: orderInfo.amount,
                })
            }


        }
        // const day =

    }
}
