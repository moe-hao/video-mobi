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

export interface CollectionListResp {
    page: number;
    size: number;
    total: number;
    list: CollectionItemResp[];
}

export interface CollectionItemResp {
    bizId: string;
    name: string;
    episodes: number;
    cover: string;
}

export interface CollectionTableListResp {
    page: number;
    size: number;
    total: number;
    list: CollectionTableListRespItem[];
}

export interface CollectionTableListRespItem {
    id: number;
    bizId: string;
    name: string;
    sourceName: string;
    episodes: number;
    cutPoint: number;
    publishStatus: PublishStatus;
    cover: string;
    collectionType: CollectionType;
    collectionTypeName: string;
    local: CollectionLocal;
    localName: string;
    languageCode: Language;
    language: string;
    videoId: number;
    desc: string;
    createTime: string;
    updateTime: string;
}

export interface CollectionCoverUploadResp {
    url: string;
}
