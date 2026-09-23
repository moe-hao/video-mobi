import z from "zod";

export const LtvReportListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    startDateBegin: z.string().default(''),
    startDateEnd: z.string().default(''),
    productIds: z.string().default(''),
    paymentChannel: z.string().default(''),
    paymentType: z.string().default(''),
});

export type LtvReportListReq = z.infer<typeof LtvReportListReqSchema>;

export const LtvReportListItemSchema = z.object({
    startDate: z.string(),
    spend: z.string(),
    d0Income: z.string(),
    d7Income: z.string(),
    d14Income: z.string(),
    d21Income: z.string(),
    d28Income: z.string(),
    d35Income: z.string(),
    d42Income: z.string(),
    d49Income: z.string(),
    d56Income: z.string(),
});

export type LtvReportListItem = z.infer<typeof LtvReportListItemSchema>;

export const LtvReportListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(LtvReportListItemSchema),
});

export type LtvReportListResp = z.infer<typeof LtvReportListRespSchema>;
