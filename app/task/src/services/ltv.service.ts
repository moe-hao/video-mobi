import { OrderStatus } from '@lib/common/consts/order';
import { orderDao } from '@lib/repo/dao/order.dao';
import { userDao } from '@lib/repo/dao/user.dao';
import type { UserSelect } from '@lib/repo/models/user';
import { startOfDay, endOfDay, parseISO, differenceInDays, fromUnixTime, formatDate } from 'date-fns';
import { ltvReportDao } from '@lib/repo/dao/ltv-report.dao';
import { exchangeProxy } from '@lib/repo/proxy/exchange/exchange';

export async function calculateLTtvReport(date: string) {
    const day = parseISO(date);
    const sTime = Math.floor(startOfDay(day).getTime() / 1000);
    const eTime = Math.floor(endOfDay(day).getTime() / 1000);

    const orderList = await orderDao.getOrderListByTimeRange(OrderStatus.Completed, sTime, eTime);
    const userIds = orderList.map((item) => item.userId);
    const userList = await userDao.getUserListByIds(userIds);
    const userIdMap = userList.reduce((prev, cur) => {
        prev.set(cur.id, cur);
        return prev;
    }, new Map<number, UserSelect>());

    const exchangeRateMap = new Map<string, number>();
    for (const orderInfo of orderList) {
        if (!exchangeRateMap.has(orderInfo.currency)) {
            if (orderInfo.currency) {
                exchangeRateMap.set(orderInfo.currency, await exchangeProxy.getExchangeRate(orderInfo.currency, 'USD'));
            }
        }
    }

    for (const orderInfo of orderList) {
        const userInfo = userIdMap.get(orderInfo.userId);
        if (userInfo) {
            const userDate = startOfDay(fromUnixTime(userInfo.createTime));
            const days = differenceInDays(startOfDay(day), startOfDay(fromUnixTime(userInfo.createTime)));
            const amountInUsd = (parseFloat(orderInfo.amount) * (exchangeRateMap.get(orderInfo.currency) || 0)).toFixed(2);

            const dateForDayReport = await ltvReportDao.getReport({
                startDate: formatDate(userDate, 'yyyy-MM-dd'),
                productId: orderInfo.productId,
                paymentChannel: orderInfo.paymentChannel,
                paymentType: orderInfo.paymentType,
                day: days,
            });

            if (dateForDayReport) {
                await ltvReportDao.updateReport(dateForDayReport.id, {
                    income: (parseFloat(dateForDayReport.income) + parseFloat(amountInUsd)).toFixed(2),
                });
            } else {
                await ltvReportDao.insertReport({
                    startDate: formatDate(userDate, 'yyyy-MM-dd'),
                    productId: orderInfo.productId,
                    paymentChannel: orderInfo.paymentChannel,
                    paymentType: orderInfo.paymentType,
                    day: days,
                    income: amountInUsd,
                });
            }
        }
    }
}

