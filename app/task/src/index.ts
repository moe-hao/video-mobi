import schedule from 'node-schedule';
import { schedulePayssionPaymentClose, schedulePayssionSubscriptionStatus } from './schedules/payssion';

const tasks = [
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionPaymentClose() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

