import z from "zod";

export const subscriptionListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    status: z.string().default('').or(z.coerce.number().int()),
    subscriptionNo: z.string().default(''),
    userId: z.string().default(''),
    startDate: z.string().default(''),
    endDate: z.string().default(''),
})

export type SubscriptionListReq = z.infer<typeof subscriptionListReqSchema>;
