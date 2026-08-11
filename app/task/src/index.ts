import schedule from 'node-schedule';
import { schedulePayssionPaymentClose, schedulePayssionSubscriptionStatus, scheduleSubscriptionOrderConfirm } from './schedules/payssion';
import { scheduleAdReportDaily, scheduleAdReportWeek, scheduleAdReportYesterday } from './schedules/ad-report-daily';

const tasks = [
    schedule.scheduleJob('0/10 * * * *', async () => { await scheduleAdReportDaily() }),
    schedule.scheduleJob('0 6 * * *', async () => { await scheduleAdReportYesterday() }),
    schedule.scheduleJob('0 2 * * *', async () => { await scheduleAdReportWeek() }),

    schedule.scheduleJob('3/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
    schedule.scheduleJob('6/10 * * * *', async () => { await schedulePayssionPaymentClose() }),
    schedule.scheduleJob('* * * * *', async () => { await scheduleSubscriptionOrderConfirm() }),
    // schedule.scheduleJob(Date.now(), async () => { await scheduleVideoUpload() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

