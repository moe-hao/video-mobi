import { logger } from '@lib/internal/logger';
import { adReportDailyService } from '../services/ad-report-daliy.service';
import { format, addDays } from "date-fns";

export async function scheduleAdReportDaily() {
    logger.info('[Start Run]: scheduleAdReportDaily');
    try {
        await adReportDailyService.asyncAdReportDaily();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: scheduleAdReportDaily');
}

export async function scheduleAdReportYesterday() {
    logger.info('[Start Run]: scheduleAdReportYesterday');
    try {
        await adReportDailyService.asyncAdReportYesterday();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: scheduleAdReportYesterday');
}

export async function scheduleAdReportWeek() {
    logger.info('[Start Run]: scheduleAdReportWeek');
    try {
        await adReportDailyService.asyncAdReportWeek();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: scheduleAdReportWeek');
}

export async function scheduleAdReport() {
    logger.info('[Start Run]: scheduleAdReport');
    let date = new Date('2026-06-24T00:00:00+08:00');
    while (format(date, 'yyyy-MM-dd') !== '2026-08-21') {
        await adReportDailyService.asyncAdReport(format(date, 'yyyy-MM-dd'));
        date = addDays(date, 1);
    }
    logger.info('[End Run]: scheduleAdReport');
}
