import z from "zod";

export const ltvReportListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    startDateBegin: z.string().default(''),
    startDateEnd: z.string().default(''),
    productIds: z.string().default(''),
    paymentChannel: z.string().default(''),
    paymentType: z.string().default(''),
});

export type LtvReportListReq = z.infer<typeof ltvReportListReqSchema>;
