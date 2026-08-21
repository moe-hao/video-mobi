import { logger } from '@lib/internal/logger';
import { adReportDailyService } from '../services/ad-report-daliy.service';

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
    await adReportDailyService.asyncAdReport("2026-07-01");
    logger.info('[End Run]: scheduleAdReport');
}
