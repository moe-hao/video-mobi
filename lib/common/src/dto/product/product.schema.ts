import { Region } from "@lib/common/consts/region";
import z from "zod";

export const ProductListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
    region: z.enum(Region).or(z.literal('')).default(''),
});

export type ProductListReq = z.infer<typeof ProductListReqSchema>;


