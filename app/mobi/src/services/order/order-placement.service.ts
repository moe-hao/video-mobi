import { PaymentFactory } from "./payment/payment";
import type { OrderCreateReq, OrderCreateResp } from "@lib/common/dto/order";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import { productDao } from "@lib/repo/dao/product.dao";
import type { UserAuthInfo } from "@lib/repo/redis/user";

export const orderPlacementService = {
    create: async (host: string, userInfo: UserAuthInfo, body: OrderCreateReq): Promise<OrderCreateResp> => {
        const skuInfo = await skuDao.getSkuByBizId(body.sku);
        if (!skuInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const paymentInfo = {
            userInfo: userInfo,
            skuInfo: skuInfo,
            productInfo: productInfo,
            orderPaymentChannel: body.paymentChannel,
            paymentType: body.paymentType,
            pixelId: body.pixelId,
            reback: body.reback,
            ad: body.ad,
            pixCPF: body.pixCPF,
            firstName: body.firstName,
            lastName: body.lastName,
        };
        const payment = PaymentFactory.createPayment(body.paymentChannel);
        const orderInfo = await payment.createOrder(paymentInfo);

        return {
            paymentId: orderInfo.paymentId,
            redirectUrl: orderInfo.redirectUrl,
            subscriptionNo: orderInfo.subscriptionNo,
        }
    }
}
