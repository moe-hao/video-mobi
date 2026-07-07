import schedule from 'node-schedule';
import { scheduleAdReportDaily } from './schedules/ad-report-daily';

const tasks = [
    schedule.scheduleJob('* * * * *', async () => { await scheduleAdReportDaily() }),
    schedule.scheduleJob('0 0 * * *', () => {
        console.log('hello world');
    }),
];

process.on('SIGINT', () => {
    console.log('正在停止所有定时任务...');
    tasks.forEach(job => job.cancel());
    process.exit(0);
});
