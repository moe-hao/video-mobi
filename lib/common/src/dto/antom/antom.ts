import type { AntomNotifyType } from "@lib/common/consts/antom";

export interface AntomPaymentNotificationReq {
    result: AntomPaymentNotificationResult;
    notifyType: AntomNotifyType;
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
