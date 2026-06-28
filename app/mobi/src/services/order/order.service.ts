import { PaymentFactory } from "./payment/payment";
import type { OrderApproveReq, OrderCloseReq, OrderCreateReq, OrderCreateResp, OrderFailedReq } from "@lib/common/dto/order";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";
import { productDao } from "@lib/repo/dao/product.dao";
import type { UserAuthInfo } from "@lib/repo/redis/user";

class OrderService {
    async create(host: string, userInfo: UserAuthInfo, body: OrderCreateReq): Promise<OrderCreateResp> {
        const skuInfo = await skuDao.getSkuByBizId(body.sku);
        if (!skuInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const orderInfo = await PaymentFactory.createPayment(body.paymentChannel).createOrder({
            userInfo: userInfo,
            skuInfo: skuInfo,
            productInfo: productInfo,
            paymentType: body.paymentType,
            pixelId: body.pixelId,
            reback: body.reback,
            ad: body.ad,
        });

        return {
            paymentId: orderInfo.paymentId,
            redirectUrl: orderInfo.redirectUrl,
            subscriptionNo: orderInfo.subscriptionNo,
        }
    }

    async approve(req: OrderApproveReq): Promise<void> {
        const payment = PaymentFactory.createPayment(req.paymentChannel);
        await payment.approveOrder({
            paymentId: req.paymentId,
            paymentType: req.paymentType,
            subscriptionNo: req.subscriptionNo,
        });
    }

    async close(req: OrderCloseReq): Promise<void> {
        const payment = PaymentFactory.createPayment(req.paymentChannel);
        await payment.closeOrder(req.paymentId);
    }

    async complete(req: OrderApproveReq): Promise<void> {
        const payment = PaymentFactory.createPayment(req.paymentChannel);
        await payment.completeOrder(req.paymentId);
    }

    async failed(req: OrderFailedReq): Promise<void> {
        const payment = PaymentFactory.createPayment(req.paymentChannel);
        await payment.failedOrder(req.paymentId);
    }
}

export const orderService = new OrderService();
