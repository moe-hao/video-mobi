import { CollectionLocal, CollectionType, PublishStatus } from "@lib/common/consts/collection";
import { Language } from "@lib/common/consts/region";
import z from "zod";

export const collectionListReqSchema = z.object({
    page: z.coerce.number().default(1),
    size: z.coerce.number().default(12),
});

export const collectionTableListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
    language: z.preprocess(
        (val) => val === '' ? '' : val,
        z.union([z.enum(Language, { error: "Param Invalid: language" }), z.literal('')]).optional()
    ),
});

export const collectionAddReqSchema = z.object({
    sourceName: z.string().min(1, { error: "Param Invalid: sourceName" }),
    name: z.string().min(1, { error: "Param Invalid: name" }),
    episodes: z.int({ error: "Param Invalid: episodes" }),
    cutPoint: z.int({ error: "Param Invalid: cutPoint" }),
    cover: z.string().default(''),
    languageCode: z.enum(Language).nonoptional({ error: "Param Invalid: languageCode" }),
    videoId: z.int().default(0),
    collectionType: z.enum(CollectionType).default(CollectionType.Normal),
    local: z.enum(CollectionLocal).default(CollectionLocal.Translated),
});

export const collectionEditReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
    name: z.string().min(1, { error: "Param Invalid: name" }),
    sourceName: z.string().default(''),
    languageCode: z.enum(Language).nonoptional({ error: "Param Invalid: languageCode" }),
    episodes: z.int({ error: "Param Invalid: episodes" }),
    cutPoint: z.int({ error: "Param Invalid: cutPoint" }),
    videoId: z.int().default(0),
    cover: z.string().default(''),
    collectionType: z.enum(CollectionType).default(CollectionType.Normal),
    local: z.enum(CollectionLocal).default(CollectionLocal.Translated),
});

export const collectionDeleteReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
});

export const collectionPublishReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
    publishStatus: z.enum(PublishStatus, { error: "Param Invalid: publishStatus" }),
})

export type CollectionListReq = z.infer<typeof collectionListReqSchema>;
export type CollectionTableListReq = z.infer<typeof collectionTableListReqSchema>;
export type CollectionAddReq = z.infer<typeof collectionAddReqSchema>;
export type CollectionEditReq = z.infer<typeof collectionEditReqSchema>;
export type CollectionDeleteReq = z.infer<typeof collectionDeleteReqSchema>;
export type CollectionPublishReq = z.infer<typeof collectionPublishReqSchema>;
