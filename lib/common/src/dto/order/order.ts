import type { OrderStatus } from "@lib/common/consts/order";
import type { PaymentType } from "@lib/common/consts/payment";

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
    userId: number;
    username: string;
    email: string;
    collectionBizId: string;
    amount: string;
    currency: string;
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

