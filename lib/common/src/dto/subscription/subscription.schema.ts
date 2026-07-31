import z from "zod";

export const subscriptionListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    status: z.string().default('').or(z.coerce.number().int()),
    subscriptionNo: z.string().default(''),
    userId: z.string().default(''),
    channel: z.string().default(''),
    startDate: z.string().default(''),
    endDate: z.string().default(''),
});

export const subscriptionCencelReqSchema = z.object({
    subscriptionId: z.number().int(),
});

export type SubscriptionListReq = z.infer<typeof subscriptionListReqSchema>;
export type SubscriptionCancelReq = z.infer<typeof subscriptionCencelReqSchema>;
