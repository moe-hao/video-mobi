import { UseePayWebhookEventName } from "@lib/common/consts/useepay";
import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { PaymentIntentEventHandler } from "./payment-intent-event-handler";
import { SubscriptionEventHandler } from "./subscription-event-handler";

export interface EventHandler {
    handle(event: UseePayWebhookEvent): Promise<void>;
}

export function createEventHandler(name: UseePayWebhookEventName): EventHandler {
    switch (name) {
        case UseePayWebhookEventName.PaymentIntentSucceeded:
        case UseePayWebhookEventName.PaymentIntentFailed:
            return new PaymentIntentEventHandler();
        case UseePayWebhookEventName.SubscriptionActive:
            return new SubscriptionEventHandler();
    }
}
