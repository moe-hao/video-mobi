export enum PublishStatus {
    Unpublished = 0,
    Published = 1,
}

export enum VodPublishStatus {
    Unpublished = 'Unpublished',
    Published = 'Published',
}

export const PublishStatusToVod: Record<PublishStatus, VodPublishStatus> = {
    [PublishStatus.Unpublished]: VodPublishStatus.Unpublished,
    [PublishStatus.Published]: VodPublishStatus.Published,
}

export const PublishStatusName: Record<PublishStatus, string> = {
    [PublishStatus.Unpublished]: '未上架',
    [PublishStatus.Published]: '已上架',
}

export const PublishStatusList = [PublishStatus.Unpublished, PublishStatus.Published]

export enum CollectionType {
    Normal = 0,
    Man = 1,
}

export const CollectionTypeName: Record<CollectionType, string> = {
    [CollectionType.Normal]: '真人剧',
    [CollectionType.Man]: '漫剧',
}

export const CollectionTypeList = [CollectionType.Normal, CollectionType.Man];

export enum CollectionLocal {
    Translated = 0,
    Original = 1,
}

export const CollectionLocalName: Record<CollectionLocal, string> = {
    [CollectionLocal.Translated]: '翻译',
    [CollectionLocal.Original]: '本土',
}

export const CollectionLocalList = [CollectionLocal.Translated, CollectionLocal.Original];
