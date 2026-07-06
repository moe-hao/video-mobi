import type { OrderStatus } from "@lib/common/consts/order";
import type { PaymentType } from "@lib/common/consts/payment";
import type { SkuType } from "@lib/common/consts/sku";

export interface OrderCreateResp {
    paymentId: string;
    redirectUrl: string;
    subscriptionNo: string;
}

export interface OrderListResp {
    page: number;
    size: number;
    total: number;
    list: OrderListRespItem[];
}

export interface OrderListRespItem {
    id: number;
    bizId: string;
    host: string;
    platfrom: string;
    userId: number;
    username: string;
    email: string;
    collectionBizId: string;
    collectionName: string;
    collectionSourceName: string;
    amount: string;
    currency: string;
    dollar: string;
    orderType: SkuType;
    subscriptionId: number;
    subscriptionCount: number;
    paymentChennel: string;
    paymentType: PaymentType;
    paymentTypeName: string;
    orderStatus: OrderStatus;
    orderStatusName: string;
    createTime: string;
    updateTime: string;
}

