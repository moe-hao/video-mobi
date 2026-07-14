
import { PayermaxPayment } from "./payermax-payment";
import { PaypalPayment } from "./paypal-payment";
import type { SkuSelect } from "@lib/repo/models/sku";
import type { ProductSelect } from "@lib/repo/models/product";
import { PaymentChannel, type PaymentType } from "@lib/common/consts/payment";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { PayssionPayment } from "./payssion-payment";

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
    pixelId: number;
    reback: string;
    ad: string;
    pixCPF: string;
    firstName: string;
    lastName: string;
}

export interface Payment {
    createOrder(paymentInfo: PaymentInfo): Promise<PaymentOrder>;
}

export class PaymentFactory {
    static createPayment(paymentChannel: PaymentChannel): Payment {
        switch (paymentChannel) {
            case PaymentChannel.Payermax:
                return new PayermaxPayment();
            case PaymentChannel.Paypal:
                return new PaypalPayment();
            case PaymentChannel.Payssion:
                return new PayssionPayment();
        }
    }
}
