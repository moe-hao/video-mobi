import z from "zod";
import { Language } from "@lib/common/consts/region";
import { CollectionFeatureSortStatus } from "@lib/common/consts/collection-feature";

export const CollectionFeatureListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    episodeSearch: z.string().default(''),
    languageCode: z.preprocess(
        (val) => val === '' ? '' : val,
        z.union([z.enum(Language, { error: "Param Invalid: language" }), z.literal('')]).optional()
    ),
    weightSort: z.preprocess(
        (val) => val === '' ? '' : Number(val),
        z.enum(CollectionFeatureSortStatus, { error: "Param Invalid: weightSort" }).optional()
    ),
});

export type CollectionFeatureListReq = z.infer<typeof CollectionFeatureListReqSchema>;

export const CollectionFeatureListRespSchema = z.object({
    page: z.number(),
    size: z.number(),
    total: z.number(),
    list: z.array(z.object({
        id: z.number(),
        collectionId: z.number(),
        weight: z.number(),
        collectionBizId: z.string(),
        name: z.string(),
        sourceName: z.string(),
        cover: z.string(),
        languageCode: z.string(),
        language: z.string(),
        createTime: z.string(),
        updateTime: z.string(),
    })),
});

export type CollectionFeatureListResp = z.infer<typeof CollectionFeatureListRespSchema>;

export const CollectionFeatureAddReqSchema = z.object({
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
    weight: z.int({ error: "Param Invalid: weight" })
});

export type CollectionFeatureAddReq = z.infer<typeof CollectionFeatureAddReqSchema>;

export const CollectionFeatureEditReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
    weight: z.int({ error: "Param Invalid: weight" })
});

export type CollectionFeatureEditReq = z.infer<typeof CollectionFeatureEditReqSchema>;

export const CollectionFeatureDeleteReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" })
});

export type CollectionFeatureDeleteReq = z.infer<typeof CollectionFeatureDeleteReqSchema>;
