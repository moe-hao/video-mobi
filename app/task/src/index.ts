import schedule from 'node-schedule';
import { schedulePayssionPaymentClose, schedulePayssionSubscriptionStatus } from './schedules/payssion';
import { scheduleAdReportDaily, scheduleAdReportWeek, scheduleAdReportYesterday } from './schedules/ad-report-daily';
// import { asyncCollectionVideoUploadStatus } from './schedules/collection';

const tasks = [
    schedule.scheduleJob('*/10 * * * *', async () => { await scheduleAdReportDaily() }),
    schedule.scheduleJob('0 6 * * *', async () => { await scheduleAdReportYesterday() }),
    schedule.scheduleJob('0 2 * * *', async () => { await scheduleAdReportWeek() }),

    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionPaymentClose() }),

    // 一次性任务：迁移完成后手动移除
    // schedule.scheduleJob(new Date(), async () => { await asyncCollectionVideoUploadStatus() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

