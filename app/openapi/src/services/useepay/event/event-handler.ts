import { UseePayWebhookEventName } from "@lib/common/consts/useepay";
import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { PaymentIntentEventHandler } from "./payment-intent-event-handler";
import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { SubscriptionEventHandler } from "./subscription-event-handler";

export interface EventHandler {
    handle(event: UseePayWebhookEvent): void;
}

export function createEventHandler(name: UseePayWebhookEventName): EventHandler {
    switch (name) {
        case UseePayWebhookEventName.PaymentIntentSucceeded:
            return new PaymentIntentEventHandler();
        case UseePayWebhookEventName.SubscriptionActive:
            return new SubscriptionEventHandler();
        default:
            throw new InternalException(ResultCode.MethodNotSupported);
    }
}
