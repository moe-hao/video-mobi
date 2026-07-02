import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import z from "zod";

export const orderCreateReqSchema = z.object({
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

export const orderApproveReqSchema = z.object({
    paymentChannel: z.enum(PaymentChannel, { message: "Payment Channel Invalid" }),
    paymentId: z.string().default(''),
    subscriptionNo: z.string().default(''),
    paymentType: z.enum(PaymentType, { message: "Payment Type Invalid" }),
});

export const orderCloseReqSchema = z.object({
    paymentChannel: z.enum(PaymentChannel, { message: "Payment Channel Invalid" }),
    paymentId: z.string().nonempty({ message: "Payment ID Required" }),
});

export const orderFailedReqSchema = z.object({
    paymentChannel: z.enum(PaymentChannel, { message: "Payment Channel Invalid" }),
    paymentId: z.string().nonempty({ message: "Payment ID Required" }),
});

export const orderListReqSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).default(10),
    search: z.string().default(''),
    status: z.string().default('').or(z.coerce.number().int()),
    productId: z.string().default('').or(z.coerce.number().int()),
    startDate: z.string().default(''),
    endDate: z.string().default(''),
});

export type OrderCreateReq = z.infer<typeof orderCreateReqSchema>;
export type OrderApproveReq = z.infer<typeof orderApproveReqSchema>;
export type OrderCloseReq = z.infer<typeof orderCloseReqSchema>;
export type OrderFailedReq = z.infer<typeof orderFailedReqSchema>;
export type OrderListReq = z.infer<typeof orderListReqSchema>;
