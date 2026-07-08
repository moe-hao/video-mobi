import { logger } from "@lib/internal/logger";
import { subscriptionPaymentService } from "../services/payssion/subscription-payment.service";

export async function schedulePayssionSubscriptionPayment() {
    logger.info('[Start Run]: schedulePayssionSubscriptionPayment');
    try {
        await subscriptionPaymentService.runSubscriptionPayment();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: schedulePayssionSubscriptionPayment');
}
