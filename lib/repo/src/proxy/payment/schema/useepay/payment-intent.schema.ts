import { struct } from "@lib/common/utils/struct";

export const createPaymentIntentPaymentMethodDataBillingAddressDataSchema = struct.schema({
    country: struct.string().name("country"),
});

export const createPaymentIntentPaymentMethodDataBillingDataSchema = struct.schema({
    address: struct.nested(createPaymentIntentPaymentMethodDataBillingAddressDataSchema).name("address"),
});

export const createPaymentIntentPaymentMethodDataPixDataSchema = struct.schema({
    identificationNumber: struct.string().name("identification_number"),
});

export const createPaymentIntentPaymentMethodDataSchema = struct.schema({
    type: struct.string().name("type"),
    firstName: struct.string().name("first_name"),
    lastName: struct.string().name("last_name"),
    billing: struct.nested(createPaymentIntentPaymentMethodDataBillingDataSchema).name("billing"),
    pix: struct.nested(createPaymentIntentPaymentMethodDataPixDataSchema).optional().name("pix"),
});

export const createPaymentIntentDeviceDataSchema = struct.schema({
    ipAddress: struct.string().name("ip_address"),
});

export const createPaymentIntentDataSchema = struct.schema({
    merchantOrderId: struct.string().name("merchant_order_id"),
    amount: struct.string().name("amount"),
    currency: struct.string().name("currency"),
    customerId: struct.string().name("customer_id"),
    confirm: struct.boolean().optional().name("confirm"),
    autoCapture: struct.boolean().optional().name("auto_capture"),
    mode: struct.enum(["payment", "subscription"]).name("mode"),
    subscriptionId: struct.string().optional().name("subscription_id"),
    returnUrl: struct.string().name("return_url"),
    paymentMethodData: struct.nested(createPaymentIntentPaymentMethodDataSchema).name("payment_method_data"),
    deviceData: struct.nested(createPaymentIntentDeviceDataSchema).name("device_data"),
});

export type CreatePaymentIntentDataInner = typeof createPaymentIntentDataSchema.$inferInner;
export type CreatePaymentIntentDataOuter = typeof createPaymentIntentDataSchema.$inferOuter;

export const createPaymentIntentNextDataRedirctResultSchema = struct.schema({
    method: struct.string().name("method"),
    url: struct.string().name("url"),
});

export const createPaymentIntentNextActionResultSchema = struct.schema({
    type: struct.string().name("type"),
    redirect: struct.nested(createPaymentIntentNextDataRedirctResultSchema).name("redirect"),
});

export const createPaymentIntentResultSchema = struct.schema({
    id: struct.string().name("id"),
    nextAction: struct.nested(createPaymentIntentNextActionResultSchema).name("next_action"),
});

export type CreatePaymentIntentResultInner = typeof createPaymentIntentResultSchema.$inferInner;
export type CreatePaymentIntentResultOuter = typeof createPaymentIntentResultSchema.$inferOuter;
