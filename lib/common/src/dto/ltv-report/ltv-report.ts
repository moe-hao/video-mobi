export interface LtvReportListResp {
    page: number;
    size: number;
    total: number;
    list: LtvReportListItem[];
}

export interface LtvReportListItem {
    startDate: string;
    productId: number;
    paymentChannel: string;
    paymentType: string;
    d0Income: string;
    d7Income: string;
    d14Income: string;
    d21Income: string;
    d28Income: string;
    d35Income: string;
    d42Income: string;
    d49Income: string;
    d56Income: string;
}
