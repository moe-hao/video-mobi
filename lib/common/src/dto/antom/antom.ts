import type { AntomNotifyType, AntomSubscriptionNotificationType } from "@lib/common/consts/antom";

export interface AntomPaymentNotificationReq {
    result: AntomPaymentNotificationResult;
    notifyType: AntomNotifyType;
    subscriptionNotificationType: AntomSubscriptionNotificationType;
    paymentId: string;
    captureRequestId?: string;
    phaseNo?: string;
    subscriptionId?: string;
    subscriptionRequestId?: string;
    paymentAmount: {
        currency: string,
        value: string,
    }
}

export interface AntomPaymentNotificationResult {
    resultCode: string;
    resultMessage: string;
    resultStatus: string;
}
