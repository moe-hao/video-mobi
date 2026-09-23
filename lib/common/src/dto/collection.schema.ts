import z from "zod";
import { CollectionLocal, CollectionType, PublishStatus } from "@lib/common/consts/collection";
import { Language } from "@lib/common/consts/region";

export const CollectionTableListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
    type: z.string().default('').or(z.enum(CollectionType)),
    publishStatus: z.string().default('').or(z.enum(PublishStatus)),
    language: z.preprocess(
        (val) => val === '' ? '' : val,
        z.union([z.enum(Language, { error: "Param Invalid: language" }), z.literal('')]).optional()
    ),
});

export type CollectionTableListReq = z.infer<typeof CollectionTableListReqSchema>;

export const CollectionAddReqSchema = z.object({
    sourceName: z.string().min(1, { error: "Param Invalid: sourceName" }),
    name: z.string().min(1, { error: "Param Invalid: name" }),
    episodes: z.int({ error: "Param Invalid: episodes" }),
    cutPoint: z.int({ error: "Param Invalid: cutPoint" }),
    cover: z.string().default(''),
    languageCode: z.enum(Language).nonoptional({ error: "Param Invalid: languageCode" }),
    videoId: z.int().default(0),
    collectionType: z.enum(CollectionType).default(CollectionType.Normal),
    local: z.enum(CollectionLocal).default(CollectionLocal.Translated),
    desc: z.string().default(''),
});

export type CollectionAddReq = z.infer<typeof CollectionAddReqSchema>;

export const CollectionEditReqSchema = z.object({
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
    desc: z.string().default(''),
});

export type CollectionEditReq = z.infer<typeof CollectionEditReqSchema>;

export const CollectionDeleteReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
});

export type CollectionDeleteReq = z.infer<typeof CollectionDeleteReqSchema>;


export const CollectionPublishReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
    publishStatus: z.enum(PublishStatus, { error: "Param Invalid: publishStatus" }),
});

export type CollectionPublishReq = z.infer<typeof CollectionPublishReqSchema>;

export const CollectionItemRespSchema = z.object({
    bizId: z.string(),
    name: z.string(),
    episodes: z.number().int(),
    cover: z.string(),
});
export type CollectionItemResp = z.infer<typeof CollectionItemRespSchema>;

export const CollectionListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(CollectionItemRespSchema),
});
export type CollectionListResp = z.infer<typeof CollectionListRespSchema>;

export const CollectionTableListRespItemSchema = z.object({
    id: z.number().int(),
    bizId: z.string(),
    name: z.string(),
    sourceName: z.string(),
    episodes: z.number().int(),
    cutPoint: z.number().int(),
    publishStatus: z.nativeEnum(PublishStatus),
    cover: z.string(),
    collectionType: z.nativeEnum(CollectionType),
    collectionTypeName: z.string(),
    local: z.nativeEnum(CollectionLocal),
    localName: z.string(),
    languageCode: z.nativeEnum(Language),
    language: z.string(),
    videoId: z.number().int(),
    desc: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type CollectionTableListRespItem = z.infer<typeof CollectionTableListRespItemSchema>;

export const CollectionTableListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(CollectionTableListRespItemSchema),
});
export type CollectionTableListResp = z.infer<typeof CollectionTableListRespSchema>;

export const CollectionCoverUploadRespSchema = z.object({
    url: z.string(),
});
export type CollectionCoverUploadResp = z.infer<typeof CollectionCoverUploadRespSchema>;
