import { Language, Region } from "@lib/common/consts/region";
import z from "zod";

export const ProductListReqSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
    search: z.string().default(''),
    region: z.enum(Region).or(z.literal('')).default(''),
});

export const ProductEditReqSchema = z.object({
    id: z.coerce.number().nonoptional(),
    host: z.string().min(1),
    region: z.enum(Region).or(z.literal('')).default(''),
    language: z.enum(Language).or(z.literal('')).default(''),
    currency: z.string().min(1),
    currencySign: z.string().min(1),
    collectionTypeList: z.array(z.number()).default([]),
});

export const ProductAddReqSchema = z.object({
    host: z.string().min(1),
    region: z.enum(Region).or(z.literal('')).default(''),
    language: z.enum(Language).or(z.literal('')).default(''),
    currency: z.string().min(1),
    currencySign: z.string().min(1),
    collectionTypeList: z.array(z.number()).default([]),
});

export type ProductListReq = z.infer<typeof ProductListReqSchema>;
export type ProductEditReq = z.infer<typeof ProductEditReqSchema>;
export type ProductAddReq = z.infer<typeof ProductAddReqSchema>;


