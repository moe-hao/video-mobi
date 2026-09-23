import type { OrderStatus } from "@lib/common/consts/order";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import type { SkuType } from "@lib/common/consts/sku";
import z from "zod";

export const OrderCreateReqSchema = z.object({
    sku: z.string().nonempty({ message: "SKU Required" }),
    paymentChannel: z.enum(PaymentChannel, { message: "Payment Channel Invalid" }),
    paymentType: z.enum(PaymentType, { message: "Payment Type Invalid" }),
    pixelId: z.number().int().default(0),
    reback: z.string().default(''),
    ad: z.string().default(''),
    pixCPF: z.string().default(''),
    firstName: z.string().default(''),
    lastName: z.string().default(''),
});

export const OrderListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
    userId: z.string().default(''),
    status: z.string().default('').or(z.coerce.number().int()),
    productId: z.string().default(''),
    startDate: z.string().default(''),
    endDate: z.string().default(''),
    orderType: z.string().default(''),
    subscriptionCount: z.string().default(''),
    collectionBizId: z.string().default(''),
    channel: z.string().default(''),
    subscriptionPeriod: z.string().default(''),
});

export const DisputeOrderReqSchema = z.object({
    search: z.string().default(''),
}).refine((data) => data.search, {
    message: "Search condition is required",
});

export type OrderCreateReq = z.infer<typeof OrderCreateReqSchema>;
export type OrderListReq = z.infer<typeof OrderListReqSchema>;
export type DisputeOrderReq = z.infer<typeof DisputeOrderReqSchema>;

export interface OrderListResp {
    page: number;
    size: number;
    total: number;
    list: OrderListRespItem[];
}

export interface OrderListRespItem {
    id: number;
    bizId: string;
    paymentId: string;
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
    subscriptionPeriod: string;
    paymentChennel: string;
    paymentType: PaymentType;
    paymentTypeName: string;
    orderStatus: OrderStatus;
    orderStatusName: string;
    createTime: string;
    updateTime: string;
}

export interface DisputeOrderResp {
    id: number;
    bizId: string;
    paymentId: string;
    userId: number;
    userNo: string;
    amount: string;
    currency: string;
    orderType: SkuType;
    subscriptionId: number;
    subscriptionCount: number;
    subscriptionPeriod: string;
    paymentChennel: string;
    paymentType: PaymentType;
    paymentTypeName: string;
    orderStatus: OrderStatus;
    orderStatusName: string;
    createTime: string;
    updateTime: string;
}
