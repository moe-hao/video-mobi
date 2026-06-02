import type { OrderPayermaxResultResp, PayermaxNotificationReq, PayermaxPaymentNotificationData } from "@lib/common/dto/payermax";
import { orderStatusHelper } from "./order/order-status-helper";
import { orderDao } from "@lib/repo/dao/order.dao";
import { PayermaxResponseCode, PayermaxResultToStatus } from "@lib/common/consts/payermax";
import { OrderFinalState } from "@lib/common/consts/order";

class PayermaxService {
    async receive(body: PayermaxNotificationReq<PayermaxPaymentNotificationData>): Promise<OrderPayermaxResultResp> {
        const orderBizId = body.data.outTradeNo;
        const paymentId = body.data.tradeToken;

        const orderInfo = await orderDao.getOrderByBizId(orderBizId);
        const targetStatus = PayermaxResultToStatus[body.data.status];

        if (orderInfo && orderInfo.paymentId === paymentId && !OrderFinalState.includes(orderInfo.orderStatus)) {
            orderStatusHelper.processChangeOrderStatus(orderInfo, targetStatus);
        }
        return { code: PayermaxResponseCode.Success, msg: 'Success' }
    }
}

export const payermaxService = new PayermaxService();
