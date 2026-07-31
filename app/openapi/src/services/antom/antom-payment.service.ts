import { AntomSubscriptionNotificationType } from "@lib/common/consts/antom";
import type { AntomPaymentNotificationReq } from "@lib/common/dto/antom";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { logger } from "@lib/internal/logger";
import { NotifyTypeOperationFactory } from "./notify-type-operation/notify-type-operation";

class AntomPaymentService {
    async receive(req: AntomPaymentNotificationReq): Promise<void> {
        if (req.notifyType) {
            await NotifyTypeOperationFactory.create(req).do();
        }

        if (req.subscriptionNotificationType) {
            await this.handleSubscriptionNotification(req);
        }
    }

    private async handleSubscriptionNotification(req: AntomPaymentNotificationReq): Promise<void> {
        const subscriptionInfo = await subscriptionDao.getSubscriptionByNo(req.subscriptionId);
        if (!subscriptionInfo) {
            logger.info(`subscriptionNo: ${req.subscriptionId}, not found.`);
            return;
        }

        if (req.subscriptionNotificationType === AntomSubscriptionNotificationType.Cancel) {
            await subscriptionDao.updateSubscriptionByNo(req.subscriptionId, {
                subscriptionStatus: SubscriptionStatus.Cancel,
            });
            logger.info(`subscriptionNo: ${req.subscriptionId}, canel.`);
        }

        if (req.subscriptionNotificationType === AntomSubscriptionNotificationType.Terminate) {
            await subscriptionDao.updateSubscriptionByNo(req.subscriptionId, {
                subscriptionStatus: SubscriptionStatus.Terminate,
            });
            logger.info(`subscriptionNo: ${req.subscriptionId}, terminate.`);
        }
    }
}

export const antomPaymentService = new AntomPaymentService();
