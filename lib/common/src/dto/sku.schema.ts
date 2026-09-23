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

export const SkuDeleteReqSchema = z.object({
    id: z.number().int().nonoptional(),
});

export type SkuManageListReq = z.infer<typeof SkuManageListReqSchema>;
export type SkuAddReq = z.infer<typeof SkuAddReqSchema>;
export type SkuEditReq = z.infer<typeof SkuEditReqSchema>;
export type SkuDeleteReq = z.infer<typeof SkuDeleteReqSchema>;

export interface SkuListResp {
    skuList: SkuListItem[];
}

export interface SkuListItem {
    bizId: string;
    firstPeriodPrice: string;
    price: string;
    currency: string;
    currencySign: string;
    skuType: string;
    periodType: string;
    paypalPlanId: string;
    coinNum: number;
    coinBonus: number;
    isRetrieve: number;
    desc: string;
    important: SkuImportant;
    paymentList: SkuPaymentListItem[];
}

export interface SkuPaymentListItem {
    paymentChannel: string;
    paymentType: string;
}

export interface SkuManageListResp {
    page: number;
    size: number;
    total: number;
    list: SkuManageListItem[];
}

export interface SkuManageListItem {
    id: number;
    bizId: string;
    productId: number;
    firstPeriodPrice: string;
    productHost: string;
    price: string;
    currency: string;
    currencySign: string;
    skuType: string;
    skuTypeName: string;
    periodType: string;
    periodTypeName: string;
    periodTotal: number;
    weight: number;
    coinNum: number;
    coinBonus: number;
    paypalPlanId: string;
    paymentOptionId: number;
    paymentOptionName: string;
    desc: string;
    important: SkuImportant;
    region: string;
    isRetrieve: number;
    retrieveOptionId: number;
    createTime: string;
    updateTime: string;
}

export interface SkuRetrieveInfo {
    exist: boolean;
    orderNum: number;
    openPaymentNum: number;
    relation: RelationType;
}
