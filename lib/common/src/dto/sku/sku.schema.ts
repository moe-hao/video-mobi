import { SkuImportant, SkuPeriodType, SkuType } from "@lib/common/consts/sku";
import z from "zod";

export const skuManageListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    search: z.string().default(''),
    productId: z.coerce.number().int().default(0),
});

export const skuAddReqSchema = z.object({
    productId: z.number().int().min(1).default(0),
    price: z.string().nonempty({ message: "Price Required" }),
    desc: z.string().default(''),
    skuType: z.enum(SkuType, { message: "Sku Type Invalid" }),
    periodType: z.enum(SkuPeriodType, { message: "Period Type Invalid" }),
    important: z.enum(SkuImportant, { message: "Important Invalid" }),
    paypalPlanId: z.string().default(''),
});

export const skuEditReqSchema = z.object({
    id: z.number().int().min(1).default(0),
    productId: z.number().int().min(1).default(0),
    price: z.string().nonempty({ message: "Price Required" }),
    desc: z.string().default(''),
    skuType: z.enum(SkuType, { message: "Sku Type Invalid" }),
    periodType: z.enum(SkuPeriodType, { message: "Period Type Invalid" }),
    important: z.enum(SkuImportant, { message: "Important Invalid" }),
    paypalPlanId: z.string().default(''),
})

export const skuDeleteReqSchema = z.object({
    id: z.number().int().nonoptional(),
});

export type SkuManageListReq = z.infer<typeof skuManageListReqSchema>;
export type SkuAddReq = z.infer<typeof skuAddReqSchema>;
export type SkuEditReq = z.infer<typeof skuEditReqSchema>;
export type SkuDeleteReq = z.infer<typeof skuDeleteReqSchema>;
