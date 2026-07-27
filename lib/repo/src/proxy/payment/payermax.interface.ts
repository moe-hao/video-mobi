import { PayermaxSubscriptionStatus } from "@lib/common/consts/payermax";

export interface PayermaxRequestBody<T> {
    version: string;
    keyVersion: string
    requestTime: string;
    appId: string;
    merchantNo: string;
    data: T;
}

export interface PayermaxOrderAndPayData {
    outTradeNo: string;
    integrate: string;
    subject: string;
    totalAmount: string;
    currency: string;
    country: string;
    userId: string;
    language: string;
    frontCallbackUrl: string;
    mitManagementUrl?: string;
    notifyUrl: string;
    subscriptionPlan?: PayermaxOrderAndPaySubscriptionPlan;
    paymentDetail?: PayermaxOrderAndPayPaymentDetail;
}

export interface PayermaxOrderAndPayResult {
    redirectUrl: string;
    outTradeNo: string;
    tradeToken: string;
    status: string;
}

export interface PayermaxOrderAndPaySubscriptionPlan {
    subscriptionNo: string;
}

export interface PayermaxOrderAndPayPaymentDetail {
    paymentMethodType: string;
    mitType: string;
    tokenForFutureUse: boolean;
    merchantInitiated: boolean;
}

export interface PayermaxSubscriptionCreateData {
    subscriptionRequestId: string;
    userId: string;
    callbackUrl: string;
    subscriptionPlan: PayermaxSubscriptionCreatePlan;
}

export interface PayermaxSubscriptionCreateResult {
    subscriptionRequestId: string;
    subscriptionNo: string;
    subscriptionStatus: PayermaxSubscriptionStatus;
}

export interface PayermaxSubscriptionCreatePlan {
    subject: string;
    description?: string;
    totalPeriods: number;
    periodRule: PayermaxSubscriptionCreatePeriodRule;
    periodAmount: PayermaxSubscriptionCreatePeriodAmount;
    trialPeriodConfig?: PayermaxSubscriptionCreatePlanTrialPeriodConfig;
}

export interface PayermaxSubscriptionCreatePlanTrialPeriodConfig {
    trialPeriodCount: number;
    trialPeriodAmount: PayermaxSubscriptionCreatePeriodAmount;
}

export interface PayermaxSubscriptionCreatePeriodRule {
    periodUnit: string;
    periodCount: number;
}

export interface PayermaxSubscriptionCreatePeriodAmount {
    amount: string;
    currency: string;
}

export interface PayermaxSubscriptionCancelData {
    subscriptionNo: string;
}

export interface PayermaxResponse<T> {
    code: string;
    msg: string;
    data: T;
}
