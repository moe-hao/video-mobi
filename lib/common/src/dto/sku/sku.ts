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
    coinNum: number;
    coinBonus: number;
    desc: string;
    important: SkuImportant;
}

export interface SkuManageListResp {
    page: number;
    size: number;
    total: number;
    list: SkuManageListItem[];
}

export interface SkuManageListItem {
    id: number;
    bizId: string;
    productId: number;
    productHost: string;
    price: string;
    currency: string;
    skuType: string;
    skuTypeName: string;
    periodType: string;
    periodTypeName: string;
    periodTotal: number;
    weight: number;
    coinNum: number;
    coinBonus: number;
    paypalPlanId: string;
    desc: string;
    important: SkuImportant;
    createTime: string;
    updateTime: string;
}
