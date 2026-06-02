import type { PayermaxOrderStatus, PayermaxSubscriptionStatus } from "@lib/common/consts/payermax";

export interface OrderPayermaxResultResp {
    code: string;
    msg: string;
}

export interface PayermaxNotificationReq<DataType> {
    code: string;
    msg: string;
    keyVersion: string;
    appId: string;
    merchantNo: string;
    notifyTime: string;
    notifyType: string;
    data: DataType;
}

export interface PayermaxPaymentNotificationData {
    outTradeNo: string;
    tradeToken: string;
    totalAmount: number;
    currency: string;
    country: string;
    status: PayermaxOrderStatus;
    completeTime: string;
}

export interface PayermaxSubscriptionNotificationData {
    subscriptionRequestId: string;
    subscriptionPlan: PayermaxSubscriptionNotificationPlan;
    userId: string;
    subscriptionPaymentDetail: PayermaxSubscriptionNotificationPaymentDetail;
}

export interface PayermaxSubscriptionNotificationPlan {
    subscriptionStatus: PayermaxSubscriptionStatus;
    subscriptionNo: string;
}

export interface PayermaxSubscriptionNotificationPaymentDetail {
    subscriptionIndex: number;
    paymentMethodType: string;
    paymentStatus: PayermaxOrderStatus;
    payAmount: {
        amount: string;
        currency: string;
    },
    lastPaymentInfo: {
        payTime: string;
        lastPaymentStatus: string;
        tradeToken: string;
    }
}

