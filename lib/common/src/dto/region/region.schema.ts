import z from "zod";

export const regionListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    search: z.string().default(''),
});

export const regionAddReqSchema = z.object({
    name: z.string().min(1, { message: "Name Required" }),
    currency: z.string().min(1, { message: "Currency Required" }),
    currencySign: z.string().min(1, { message: "Currency Sign Required" }),
});

export const regionEditReqSchema = z.object({
    id: z.number().int().min(1),
    name: z.string().min(1, { message: "Name Required" }),
    currency: z.string().min(1, { message: "Currency Required" }),
    currencySign: z.string().min(1, { message: "Currency Sign Required" }),
});

export const regionDeleteReqSchema = z.object({
    id: z.number().int().nonoptional(),
});

export type RegionListReq = z.infer<typeof regionListReqSchema>;
export type RegionAddReq = z.infer<typeof regionAddReqSchema>;
export type RegionEditReq = z.infer<typeof regionEditReqSchema>;
export type RegionDeleteReq = z.infer<typeof regionDeleteReqSchema>;
