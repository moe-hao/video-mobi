import { struct } from "@lib/common/utils/struct";

export const createCustomerDataSchema = struct.schema({
    merchantCustomerId: struct.string().name("merchant_customer_id"),
    name: struct.string().name("name"),
    email: struct.string().name("email"),
});

export type CreateCustomerDataInner = typeof createCustomerDataSchema.$inferInner;
export type CreateCustomerDataOuter = typeof createCustomerDataSchema.$inferOuter;

export const createCustomerResultSchema = struct.schema({
    id: struct.string().name("id"),
});

export type CreateCustomerResultInner = typeof createCustomerResultSchema.$inferInner;
export type CreateCustomerResultOuter = typeof createCustomerResultSchema.$inferOuter;
