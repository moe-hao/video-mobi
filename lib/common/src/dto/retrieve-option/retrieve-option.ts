export interface RetrieveOptionListResp {
    page: number;
    size: number;
    total: number;
    list: RetrieveOptionListRespItem[];
}

export interface RetrieveOptionListRespItem {
    id: number;
    name: string;
    orderNum: number;
    openPaymentNum: number;
    relation: string;
    relationName: string;
    createTime: string;
    updateTime: string;
}
