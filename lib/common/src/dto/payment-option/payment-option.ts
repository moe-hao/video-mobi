import { z } from "zod";
import { paymentOptionAddReqSchema, paymentOptionDeleteReqSchema, paymentOptionEditReqSchema, paymentOptionListReqSchema, paymentOptionContentItemSchema, paymentOptionItemsReqSchema } from "./payment-option.schema";

export type PaymentOptionListReq = z.infer<typeof paymentOptionListReqSchema>;
export type PaymentOptionAddReq = z.infer<typeof paymentOptionAddReqSchema>;
export type PaymentOptionEditReq = z.infer<typeof paymentOptionEditReqSchema>;
export type PaymentOptionDeleteReq = z.infer<typeof paymentOptionDeleteReqSchema>;
export type PaymentOptionContentItemReq = z.infer<typeof paymentOptionContentItemSchema>;
export type PaymentOptionItemsReq = z.infer<typeof paymentOptionItemsReqSchema>;

export interface PaymentOptionListResp {
    page: number;
    size: number;
    total: number;
    list: PaymentOptionListRespItem[];
}

export interface PaymentOptionContentItem {
    paymentType: string;
    paymentChannel: string;
    sort?: number;
}

export interface PaymentOptionListRespItem {
    id: number;
    name: string;
    createTime: string;
    updateTime: string;
}
