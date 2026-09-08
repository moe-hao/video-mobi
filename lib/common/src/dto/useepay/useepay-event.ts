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
}

export interface UseePayWebhookEventDataRecurring {
    current_billing_cycles: number;
}

export interface UseePayWebhookEventDataLatestInvoice {
    id: string;
    payment_intent: { merchant_order_id: string; };
}
