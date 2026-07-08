import schedule from 'node-schedule';
import { onceCreateSubscriptionPayment, schedulePayssionPaymentClose, schedulePayssionSubscriptionStatus } from './schedules/payssion';

const now = new Date();
const startTime = new Date(now.getTime() + 35 * 1000);

const tasks = [
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionPaymentClose() }),
    schedule.scheduleJob(startTime, async () => { await onceCreateSubscriptionPayment() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

