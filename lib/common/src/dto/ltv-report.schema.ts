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

export interface LtvReportListResp {
    page: number;
    size: number;
    total: number;
    list: LtvReportListItem[];
}

export interface LtvReportListItem {
    startDate: string;
    spend: string;
    d0Income: string;
    d7Income: string;
    d14Income: string;
    d21Income: string;
    d28Income: string;
    d35Income: string;
    d42Income: string;
    d49Income: string;
    d56Income: string;
}
