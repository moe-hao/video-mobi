export enum UseePayWebhookEventName {
    PaymentIntentSucceeded = "payment_intent.succeeded",
    PaymentIntentFailed = "payment_intent.failed",
    SubscriptionActive = "subscription.active",
}

export enum UseePayWebhookEventDataStatus {
    PaymentIntentSucceeded = "succeeded",
    PaymentIntentFailed = "failed",
    SubscriptionActive = "active",
}
