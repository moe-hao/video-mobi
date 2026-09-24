import { CollectionType } from "@lib/common/consts/collection";
import { Language, Region } from "@lib/common/consts/region";
import z from "zod";

export const ProductListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
    region: z.enum(Region).or(z.literal('')).default(''),
});

export type ProductListReq = z.infer<typeof ProductListReqSchema>;

export const ProductEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    host: z.string().min(1),
    region: z.enum(Region).or(z.literal('')).default(''),
    language: z.enum(Language).or(z.literal('')).default(''),
    currency: z.string().min(1),
    currencySign: z.string().min(1),
    coinUnlock: z.coerce.number().min(0).default(0),
    desc: z.string().default(''),
    collectionTypeList: z.array(z.number()).default([]),
});

export type ProductEditReq = z.infer<typeof ProductEditReqSchema>;

export const ProductAddReqSchema = z.object({
    host: z.string().min(1),
    region: z.enum(Region).or(z.literal('')).default(''),
    language: z.enum(Language).or(z.literal('')).default(''),
    currency: z.string().min(1),
    currencySign: z.string().min(1),
    coinUnlock: z.coerce.number().min(0).default(0),
    desc: z.string().default(''),
    collectionTypeList: z.array(z.number()).default([]),
});

export type ProductAddReq = z.infer<typeof ProductAddReqSchema>;

export const ProductInfoRespSchema = z.object({
    region: z.enum(Region),
    language: z.enum(Language),
    currency: z.string(),
    currencySign: z.string(),
    coinUnlock: z.number().int(),
});
export type ProductInfoResp = z.infer<typeof ProductInfoRespSchema>;

export const ProductListRespItemSchema = z.object({
    id: z.number().int(),
    host: z.string(),
    region: z.enum(Region),
    regionName: z.string(),
    language: z.enum(Language),
    languageName: z.string(),
    currency: z.string(),
    currencySign: z.string(),
    coinUnlock: z.number().int(),
    desc: z.string(),
    collectionTypeList: z.array(z.enum(CollectionType)),
    createTime: z.string(),
    updateTime: z.string(),
});

export type ProductListRespItem = z.infer<typeof ProductListRespItemSchema>;

export const ProductListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(ProductListRespItemSchema),
});

export type ProductListResp = z.infer<typeof ProductListRespSchema>;
