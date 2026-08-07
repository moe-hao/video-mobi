import z from "zod";

export const retrieveOptionListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
});

export const retrieveOptionEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    name: z.string().min(1),
    orderNum: z.coerce.number().min(0).default(0),
    openPaymentNum: z.coerce.number().min(0).default(0),
    relation: z.string().default(''),
});

export const retrieveOptionAddReqSchema = z.object({
    name: z.string().min(1),
    orderNum: z.coerce.number().min(0).default(0),
    openPaymentNum: z.coerce.number().min(0).default(0),
    relation: z.string().default(''),
});

export const retrieveOptionDeleteReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
});

export type RetrieveOptionListReq = z.infer<typeof retrieveOptionListReqSchema>;
export type RetrieveOptionEditReq = z.infer<typeof retrieveOptionEditReqSchema>;
export type RetrieveOptionAddReq = z.infer<typeof retrieveOptionAddReqSchema>;
export type RetrieveOptionDeleteReq = z.infer<typeof retrieveOptionDeleteReqSchema>;
