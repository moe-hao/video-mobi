import { OrderStatus } from "@lib/common/consts/order";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { SkuType } from "@lib/common/consts/sku";
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

export type OrderCreateReq = z.infer<typeof OrderCreateReqSchema>;

export const OrderCreateRespSchema = z.object({
    paymentId: z.string(),
    redirectUrl: z.string(),
    subscriptionNo: z.string(),
});

export type OrderCreateResp = z.infer<typeof OrderCreateRespSchema>;

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

export type OrderListReq = z.infer<typeof OrderListReqSchema>;

export const DisputeOrderReqSchema = z.object({
    search: z.string().default(''),
}).refine((data) => data.search, {
    message: "Search condition is required",
});

export type DisputeOrderReq = z.infer<typeof DisputeOrderReqSchema>;

export const OrderListRespItemSchema = z.object({
    id: z.number().int(),
    bizId: z.string(),
    paymentId: z.string(),
    host: z.string(),
    platfrom: z.string(),
    userId: z.number().int(),
    username: z.string(),
    email: z.string(),
    collectionBizId: z.string(),
    collectionName: z.string(),
    collectionSourceName: z.string(),
    amount: z.string(),
    currency: z.string(),
    dollar: z.string(),
    orderType: z.enum(SkuType),
    subscriptionId: z.number().int(),
    subscriptionCount: z.number().int(),
    subscriptionPeriod: z.string(),
    paymentChennel: z.string(),
    paymentType: z.enum(PaymentType),
    paymentTypeName: z.string(),
    orderStatus: z.enum(OrderStatus),
    orderStatusName: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});
export type OrderListRespItem = z.infer<typeof OrderListRespItemSchema>;

export const OrderListRespSchema = z.object({
    page: z.number().int(),
    size: z.number().int(),
    total: z.number().int(),
    list: z.array(OrderListRespItemSchema),
});

export type OrderListResp = z.infer<typeof OrderListRespSchema>;

export const DisputeOrderRespSchema = z.object({
    id: z.number().int(),
    bizId: z.string(),
    paymentId: z.string(),
    userId: z.number().int(),
    userNo: z.string(),
    amount: z.string(),
    currency: z.string(),
    orderType: z.enum(SkuType),
    subscriptionId: z.number().int(),
    subscriptionCount: z.number().int(),
    subscriptionPeriod: z.string(),
    paymentChennel: z.string(),
    paymentType: z.enum(PaymentType),
    paymentTypeName: z.string(),
    orderStatus: z.enum(OrderStatus),
    orderStatusName: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
});

export type DisputeOrderResp = z.infer<typeof DisputeOrderRespSchema>;
