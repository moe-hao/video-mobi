import type { Language, Region } from "@lib/common/consts/region";

export interface ProductInfoResp {
    region: Region;
    language: Language;
    currency: string;
}

export interface ProductListResp {
    page: number;
    size: number;
    total: number;
    list: ProductListRespItem[];
}

export interface ProductListRespItem {
    id: number;
    host: string;
    region: Region;
    regionName: string;
    language: Language;
    languageName: string;
    currency: string;
    currencySign: string;
    createTime: string;
    updateTime: string;
}
