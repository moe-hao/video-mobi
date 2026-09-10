import type { UseePayPaymentMethod } from "@lib/common/consts/payment";

export interface CreateCustomerReq {
    merchantCustomerId: string;
    name: string;
    email: string;
}

export interface CreateCustomerResp {
    id: string;
}

export interface CreateSubscriptionReq {
    customerId?: string;
    recurring: CreateSubscriptionRecurringReq;
    currency: string;
    currentPeriodStart?: string;
}

export interface CreateSubscriptionRecurringReq {
    interval: string;
    intervalCount: number;
    unitAmount: string;
    totalBillingCycles: number;
}

export interface CreateSubscriptionResp {
    id: string;
}

export interface CreateInvoiceReq {
    currency: string;
    totalAmount: string;
    // customerId: string;
    subscriptionId: string;
}

export interface CreateInvoiceResp {
    id: string;
}

export interface CreatePaymentIntentReq {
    merchantOrderId: string;
    amount: string;
    currency: string;
    customerId?: string;
    confirm?: boolean;
    autoCapture?: boolean;
    mode: "payment" | "subscription";
    invoiceId?: string;
    subscriptionId?: string;
    returnUrl: string;
    paymentMethodData?: CreatePaymentIntentPaymentMethodDataReq;
    paymentMethodTypes?: UseePayPaymentMethod[];
    deviceData?: { ipAddress: string; };
}

export interface CreatePaymentIntentPaymentMethodDataReq {
    type: string;
    firstName?: string;
    lastName?: string;
    billing?: CreatePaymentIntentPaymentMethodDataBillingReq;
    pix?: { identificationNumber: string; };
}

export interface CreatePaymentIntentPaymentMethodDataBillingReq {
    address: { country: string; };
}

export interface CreatePaymentIntentResp {
    id: string;
    nextAction: CreatePaymentIntentNextActionResp;
}

export interface CreatePaymentIntentNextActionResp {
    type: string;
    redirect: { method: string, url: string };
}

export interface CreateWebhookReq {
    url: string;
    events: string[];
    apiVersion: string;
}

export interface CreateWebhookResp {
    id: string;
}
