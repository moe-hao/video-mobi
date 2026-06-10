import type { SkuImportant } from "@lib/common/consts/sku";

export interface SkuListResp {
    skuList: SkuListItem[];
}

export interface SkuListItem {
    bizId: string;
    price: string;
    skuType: string;
    periodType: string;
    paypalPlanId: string;
    desc: string;
    important: SkuImportant;
}
