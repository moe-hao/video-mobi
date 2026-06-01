import z from "zod";

export const subscriptionListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
})

export type SubscriptionListReq = z.infer<typeof subscriptionListReqSchema>;
