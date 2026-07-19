export interface RegionListResp {
    page: number;
    size: number;
    total: number;
    list: RegionListItem[];
}

export interface RegionListItem {
    id: number;
    name: string;
    currency: string;
    currencySign: string;
    createTime: string;
    updateTime: string;
}
