export enum PaypalOrderStatus {
    Completed = 'COMPLETED',
}

export enum PaypalEventStatus {
    Success = 'SUCCESS',
}

export enum PaypalResourceType {
    Subscription = 'subscription',
    Sale = 'sale',
}

export enum PaypalEventType {
    BillingSubscriptionActivated = 'BILLING.SUBSCRIPTION.ACTIVATED',
    BillingSubscriptionCreated = 'BILLING.SUBSCRIPTION.CREATED',
    PaymentSaleCompleted = 'PAYMENT.SALE.COMPLETED',
}
