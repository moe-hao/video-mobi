import schedule from 'node-schedule';
import { schedulePayssionPaymentClose, schedulePayssionSubscriptionStatus } from './schedules/payssion';
import { scheduleAdReportDaily, scheduleAdReportWeek, scheduleAdReportYesterday } from './schedules/ad-report-daily';
import { adReportDailyService } from './services/ad-report-daliy.service';

const tasks = [
    schedule.scheduleJob(new Date(Date.now() + 30_000), async () => {
        await adReportDailyService.syncAdReportRange('2026-06-24', '2026-07-09');
    }),

    schedule.scheduleJob('*/10 * * * *', async () => { await scheduleAdReportDaily() }),
    schedule.scheduleJob('0 6 * * *', async () => { await scheduleAdReportYesterday() }),
    schedule.scheduleJob('0 2 * * *', async () => { await scheduleAdReportWeek() }),

    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionPaymentClose() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

