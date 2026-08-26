import { logger } from "@lib/internal/logger";
import { statRenewalReport } from "../services/subscription/renewal-report.service";
import { format, addDays } from "date-fns";
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
        await calculateLTtvReport("2026-08-01");
        await calculateLTtvReport("2026-08-02");
        await calculateLTtvReport("2026-08-03");
        await calculateLTtvReport("2026-08-04");
        await calculateLTtvReport("2026-08-05");
        await calculateLTtvReport("2026-08-06");
        await calculateLTtvReport("2026-08-07");
        await calculateLTtvReport("2026-08-08");
        await calculateLTtvReport("2026-08-09");
        await calculateLTtvReport("2026-08-10");
        await calculateLTtvReport("2026-08-11");
        await calculateLTtvReport("2026-08-12");
        await calculateLTtvReport("2026-08-13");
        await calculateLTtvReport("2026-08-14");
        await calculateLTtvReport("2026-08-15");
        await calculateLTtvReport("2026-08-16");
        await calculateLTtvReport("2026-08-17");
        await calculateLTtvReport("2026-08-18");
        await calculateLTtvReport("2026-08-19");
        await calculateLTtvReport("2026-08-20");
        await calculateLTtvReport("2026-08-21");
        await calculateLTtvReport("2026-08-22");
        await calculateLTtvReport("2026-08-23");
        await calculateLTtvReport("2026-08-24");
        await calculateLTtvReport("2026-08-25");
    } catch (error) {
        logger.error(`[Failed] scheduleTtvReport: ${error}`);
    }
    logger.info('[End Run] scheduleTtvReport');
}
