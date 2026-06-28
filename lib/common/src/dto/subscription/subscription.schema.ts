import z from "zod";

export const subscriptionListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    id: z.string().default('').or(z.coerce.number().int()),
    status: z.string().default('').or(z.coerce.number().int()),
})

export type SubscriptionListReq = z.infer<typeof subscriptionListReqSchema>;
