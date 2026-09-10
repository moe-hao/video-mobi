import type { UseePayPaymentMethod } from "@lib/common/consts/payment";
import type { UseePayWebhookEventDataStatus, UseePayWebhookEventName } from "@lib/common/consts/useepay";

export interface UseePayWebhookEvent {
    id: string;
    name: UseePayWebhookEventName;
    data: UseePayWebhookEventData;
}

export interface UseePayWebhookEventData {
    id: string;
    status: UseePayWebhookEventDataStatus;
    order_id?: string;
    merchant_order_id?: string;
    recurring?: UseePayWebhookEventDataRecurring;
    latest_invoice?: UseePayWebhookEventDataLatestInvoice;
    paymentAttempt?: UseePayWebhookEventDataPaymentAttempt;
}

export interface UseePayWebhookEventDataRecurring {
    current_billing_cycles: number;
}

export interface UseePayWebhookEventDataLatestInvoice {
    id: string;
    payment_intent: { merchant_order_id: string; };
}

export interface UseePayWebhookEventDataPaymentAttempt {
    payment_method_details: UseePayPaymentMethod;
}
