import { logger } from "@lib/internal/logger";
import { statRenewalReport } from "../services/subscription/renewal-report.service";
import { format, addDays } from "date-fns";

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
