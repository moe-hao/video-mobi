import { CollectionFeatureSortStatus } from "@lib/common/consts/collection-feature";
import { Language } from "@lib/common/consts/region";
import z from "zod";

export const collectionFeatureListReqSchema = z.object({
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

export const collectionFeatureAddReqSchema = z.object({
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
    weight: z.int({ error: "Param Invalid: weight" })
});

export const collectionFeatureEditReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" }),
    collectionId: z.int({ error: "Param Invalid: collectionId" }),
    weight: z.int({ error: "Param Invalid: weight" })
});

export const collectionFeatureDeleteReqSchema = z.object({
    id: z.int({ error: "Param Invalid: id" })
});

export type CollectionFeatureListReq = z.infer<typeof collectionFeatureListReqSchema>;
export type CollectionFeatureAddReq = z.infer<typeof collectionFeatureAddReqSchema>;
export type CollectionFeatureEditReq = z.infer<typeof collectionFeatureEditReqSchema>;
export type CollectionFeatureDeleteReq = z.infer<typeof collectionFeatureDeleteReqSchema>;
