import { logger } from "@lib/internal/logger";
import { subscriptionPaymentService } from "../services/payssion/subscription-payment.service";

export async function schedulePayssionSubscriptionStatus() {
    logger.info('[Start Run]: schedulePayssionSubscriptionStatus');
    try {
        await subscriptionPaymentService.asyncSubscriptionStatus();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: schedulePayssionSubscriptionStatus');
}

export async function schedulePayssionPaymentClose() {
    logger.info('[Start Run]: schedulePayssionPaymentClose');
    try {
        await subscriptionPaymentService.closeExpiredPayment();
    } catch (error) {
        logger.error(`[Failed] ${error}`);
    }
    logger.info('[End Run]: schedulePayssionPaymentClose');
}

export async function onceCreateSubscriptionPayment() {
    logger.info('[Start Run]: onceCreateSubscriptionPayment');
    await subscriptionPaymentService.createSubscriptionPayment();
    logger.info('[End Run]: onceCreateSubscriptionPayment');
}
