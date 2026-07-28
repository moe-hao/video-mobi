import schedule from 'node-schedule';
import { schedulePayssionPaymentClose, schedulePayssionSubscriptionStatus } from './schedules/payssion';
import { scheduleAdReportDaily, scheduleAdReportOnce, scheduleAdReportWeek, scheduleAdReportYesterday } from './schedules/ad-report-daily';

const tasks = [
    schedule.scheduleJob('*/10 * * * *', async () => { await scheduleAdReportDaily() }),
    schedule.scheduleJob('0 6 * * *', async () => { await scheduleAdReportYesterday() }),
    schedule.scheduleJob('0 2 * * *', async () => { await scheduleAdReportWeek() }),

    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionPaymentClose() }),
    schedule.scheduleJob(Date.now(), async () => { await scheduleAdReportOnce() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

