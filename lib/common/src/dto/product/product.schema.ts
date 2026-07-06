import { Language, Region } from "@lib/common/consts/region";
import z from "zod";

export const productListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
    region: z.enum(Region).or(z.literal('')).default(''),
});

export const productEditReqSchema = z.object({
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

export const productAddReqSchema = z.object({
    host: z.string().min(1),
    region: z.enum(Region).or(z.literal('')).default(''),
    language: z.enum(Language).or(z.literal('')).default(''),
    currency: z.string().min(1),
    currencySign: z.string().min(1),
    coinUnlock: z.coerce.number().min(0).default(0),
    desc: z.string().default(''),
    collectionTypeList: z.array(z.number()).default([]),
});

export type ProductListReq = z.infer<typeof productListReqSchema>;
export type ProductEditReq = z.infer<typeof productEditReqSchema>;
export type ProductAddReq = z.infer<typeof productAddReqSchema>;


