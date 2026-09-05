import { struct } from "@lib/common/utils/struct";

export const createSubscriptionRecurringDataSchema = struct.schema({
    interval: struct.string().name("interval"),
    unitAmount: struct.string().name("unit_amount"),
    intervalCount: struct.number().name("interval_count"),
    totalBillingCycles: struct.number().name("total_billing_cycles"),
});

export const createSubscriptionDataSchema = struct.schema({
    customerId: struct.string().name("customer_id"),
    recurring: struct.nested(createSubscriptionRecurringDataSchema).name("recurring"),
    currency: struct.string().name("currency"),
    currentPeriodStart: struct.string().name("current_period_start"),
});

export type CreateSubscriptionDataInner = typeof createSubscriptionDataSchema.$inferInner;
export type CreateSubscriptionDataOuter = typeof createSubscriptionDataSchema.$inferOuter;

export const createSubscriptionPaymentIntentResultSchema = struct.schema({
    invoiceId: struct.string().name("invoice_id"),
});

export const createSubscriptionRespSchema = struct.schema({
    id: struct.string().name("id"),
});

export type CreateSubscriptionResultInner = typeof createSubscriptionRespSchema.$inferInner;
export type CreateSubscriptionResultOuter = typeof createSubscriptionRespSchema.$inferOuter;
