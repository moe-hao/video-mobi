import schedule from 'node-schedule';
// import { scheduleAdReportDaily } from './schedules/ad-report-daily';
import { schedulePayssionSubscriptionStatus } from './schedules/payssion';
// import { payssionProxy } from '@lib/repo/proxy/payment/payssion';
// await schedulePayssionSubscriptionPayment();

const tasks = [
    // schedule.scheduleJob('* * * * *', async () => { await scheduleAdReportDaily() }),
    schedule.scheduleJob('*/10 * * * *', async () => { await schedulePayssionSubscriptionStatus() }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});

// import { payssionProxy } from '@lib/repo/proxy/payment/payssion';

// await payssionProxy.createPaymentBySubscription();
// await payssionProxy.getMandateDetail();

// const paymentList = await payssionProxy.getSubscriptionPaymentList('sub_fTuvDGnbP4y1r9iD');
// console.log(paymentList);
