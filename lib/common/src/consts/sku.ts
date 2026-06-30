export enum SkuType {
    Subscription = "subscription",
}

export const SkuTypeName = {
    [SkuType.Subscription]: "订阅",
}

export enum SkuPeriodType {
    Week = "W",
    Month = "M",
    Year = "Y",
}

export const SkuPeriodTypeName = {
    [SkuPeriodType.Week]: "周",
    [SkuPeriodType.Month]: "月",
    [SkuPeriodType.Year]: "年",
}

export const SkuPeriodTypeToPayssionPeriodType = {
    [SkuPeriodType.Week]: "week",
    [SkuPeriodType.Month]: "month",
    [SkuPeriodType.Year]: "year",
}

export enum SkuImportant {
    No = 0,
    Yes = 1,
}
