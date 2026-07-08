import { logger } from "@lib/internal/logger";
import { subscriptionPaymentService } from "../services/payssion/subscription-payment.service";

export async function schedulePayssionSubscriptionStatus() {
    logger.info('[Start Run]: schedulePayssionSubscriptionStatus');
    try {
        await subscriptionPaymentService.asynSubscriptionStatus();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: schedulePayssionSubscriptionStatus');
}
