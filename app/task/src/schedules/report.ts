import { logger } from "@lib/internal/logger";
import { statRenewalReport } from "../services/subscription/renewal-report.service";
import { format, addDays, eachDayOfInterval, parseISO } from "date-fns";
import { adReportDailyService } from "../services/ad-report-daliy.service";
import { calculateLTtvReport } from "../services/ltv.service";

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

export async function scheduleSubscriptionRenewalReport() {
    logger.info('[Start Run] scheduleSubscriptionRenewalReport');
    try {
        const date = format(addDays(new Date(), -1), 'yyyy-MM-dd');
        logger.info(`[Run] scheduleSubscriptionRenewalReport: ${date}`);
        await statRenewalReport(date);
    } catch (error) {
        logger.error(`[Failed] scheduleSubscriptionRenewalReport: ${error}`);
    }
    logger.info('[End Run] scheduleSubscriptionRenewalReport');
}

export async function scheduleTtvReport() {
    logger.info('[Start Run] scheduleTtvReport');
    try {
        const startDate = parseISO('2026-06-26');
        const endDate = parseISO('2026-08-26');
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        for (const day of days) {
            await calculateLTtvReport(format(day, 'yyyy-MM-dd'));
        }
    } catch (error) {
        logger.error(`[Failed] scheduleTtvReport: ${error}`);
    }
    logger.info('[End Run] scheduleTtvReport');
}
