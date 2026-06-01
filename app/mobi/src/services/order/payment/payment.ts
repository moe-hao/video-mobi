
import { PayermaxPayment } from "./payermax-payment";
import { PaypalPayment } from "./paypal-payment";
import type { SkuSelect } from "@lib/repo/models/sku";
import type { ProductSelect } from "@lib/repo/models/product";
import { PaymentChannel, type PaymentType } from "@lib/common/consts/payment";
import type { UserAuthInfo } from "@lib/repo/redis/user";

export type PaymentOrder = {
    orderId: number;
    orderBizId: string;
    subscriptionNo: string;
    paymentId: string;
    redirectUrl: string;
}

export type PaymentInfo = {
    userInfo: UserAuthInfo;
    skuInfo: SkuSelect;
    productInfo: ProductSelect;
    paymentType: PaymentType;
}

export type PaymentApproveInfo = {
    paymentId: string;
    subscriptionNo: string;
    paymentType: PaymentType;
}

export interface Payment {
    createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder>;
    approveOrder(approveInfo: PaymentApproveInfo): Promise<void>;
    closeOrder(paymentId: string): Promise<void>;
    completeOrder(paymentId: string): Promise<void>;
    failedOrder(paymentId: string): Promise<void>;
}

export class PaymentFactory {
    static createPayment(paymentChannel: PaymentChannel): Payment {
        switch (paymentChannel) {
            case PaymentChannel.Payermax:
                return new PayermaxPayment();
            case PaymentChannel.Paypal:
                return new PaypalPayment();
        }
    }
}
