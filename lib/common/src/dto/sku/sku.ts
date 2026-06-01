export interface SkuListResp {
    skuList: SkuListItem[];
}

export interface SkuListItem {
    bizId: string;
    price: string;
    skuType: string;
    periodType: string;
    paypalPlanId: string;
}
