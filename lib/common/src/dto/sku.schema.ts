import type { RelationType } from "@lib/common/consts/relation";
import { SkuImportant, SkuPeriodType, SkuType } from "@lib/common/consts/sku";
import z from "zod";

export const SkuManageListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(20),
    search: z.string().default(''),
    productId: z.coerce.number().int().default(0),
    region: z.string().default(''),
});

export type SkuManageListReq = z.infer<typeof SkuManageListReqSchema>;

export const SkuAddReqSchema = z.object({
    productId: z.number().int().min(1).default(0),
    firstPeriodPrice: z.string().default(''),
    price: z.string().nonempty({ message: "Price Required" }),
    desc: z.string().default(''),
    skuType: z.enum(SkuType, { message: "Sku Type Invalid" }),
    coinNum: z.number().int().default(0),
    coinBonus: z.number().int().default(0),
    periodType: z.enum(SkuPeriodType).or(z.string().default('')),
    periodTotal: z.number().int().default(0),
    weight: z.number().int().default(0),
    important: z.enum(SkuImportant, { message: "Important Invalid" }),
    paypalPlanId: z.string().default(''),
    paymentOptionId: z.number().int().default(0),
    region: z.string().default(''),
    currency: z.string().default(''),
    currencySign: z.string().default(''),
    isRetrieve: z.number().int().default(0),
    retrieveOptionId: z.number().int().default(0),
});

export type SkuAddReq = z.infer<typeof SkuAddReqSchema>;

export const SkuEditReqSchema = z.object({
    id: z.number().int().min(1).default(0),
    productId: z.number().int().min(1).default(0),
    firstPeriodPrice: z.string().default(''),
    price: z.string().nonempty({ message: "Price Required" }),
    desc: z.string().default(''),
    skuType: z.enum(SkuType, { message: "Sku Type Invalid" }),
    coinNum: z.number().int().default(0),
    coinBonus: z.number().int().default(0),
    periodType: z.enum(SkuPeriodType).or(z.string().default('')),
    periodTotal: z.number().int().default(0),
    weight: z.number().int().default(0),
    important: z.enum(SkuImportant, { message: "Important Invalid" }),
    paypalPlanId: z.string().default(''),
    paymentOptionId: z.number().int().default(0),
    region: z.string().default(''),
    currency: z.string().default(''),
    currencySign: z.string().default(''),
    isRetrieve: z.number().int().default(0),
    retrieveOptionId: z.number().int().default(0),
});

export type SkuEditReq = z.infer<typeof SkuEditReqSchema>;

export const SkuDeleteReqSchema = z.object({
    id: z.number().int().nonoptional(),
});

export type SkuDeleteReq = z.infer<typeof SkuDeleteReqSchema>;

export const SkuPaymentListItemSchema = z.object({
    paymentChannel: z.string(),
    paymentType: z.string(),
});
export type SkuPaymentListItem = z.infer<typeof SkuPaymentListItemSchema>;

export const SkuListItemSchema = z.object({
    bizId: z.string(),
    firstPeriodPrice: z.string(),
    price: z.string(),
    currency: z.string(),
    currencySign: z.string(),
    skuType: z.string(),
    periodType: z.string(),
    paypalPlanId: z.string(),
    coinNum: z.number().int(),
    coinBonus: z.number().int(),
    isRetrieve: z.number().int(),
    desc: z.string(),
    important: z.enum(SkuImportant),
    paymentList: z.array(SkuPaymentListItemSchema),
});
export type SkuListItem = z.infer<typeof SkuListItemSchema>;

export const SkuListRespSchema = z.object({
    skuList: z.array(SkuListItemSchema),
});
export type SkuListResp = z.infer<typeof SkuListRespSchema>;

export const SkuManageListItemSchema = z.object({
    id: z.number().int(),
    bizId: z.string(),
    productId: z.number().int(),
    firstPeriodPrice: z.string(),
    productHost: z.string(),
    price: z.string(),
    currency: z.string(),
    currencySign: z.string(),
    skuType: z.string(),
    skuTypeName: z.string(),
    periodType: z.string(),
    periodTypeName: z.string(),
    periodTotal: z.number().int(),
    weight: z.number().int(),
    coinNum: z.number().int(),
    coinBonus: z.number().int(),
    paypalPlanId: z.string(),
    paymentOptionId: z.number().int(),
    paymentOptionName: z.string(),
    desc: z.string(),
    important: z.enum(SkuImportant),
    region: z.string(),
    isRetrieve: z.number().int(),
    retrieveOptionId: z.number().int(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type SkuManageListItem = z.infer<typeof SkuManageListItemSchema>;

export const SkuManageListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(SkuManageListItemSchema),
});
export type SkuManageListResp = z.infer<typeof SkuManageListRespSchema>;

export const SkuRetrieveInfoSchema = z.object({
    exist: z.boolean(),
    orderNum: z.number().int(),
    openPaymentNum: z.number().int(),
    relation: z.string() as z.ZodType<RelationType>,
});

export type SkuRetrieveInfo = z.infer<typeof SkuRetrieveInfoSchema>;
