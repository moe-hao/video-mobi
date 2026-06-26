import { Hono } from "hono";
import { paypalEventService } from "../services/paypal/paypal-event-service";
import type { PaypalEventReq } from "@lib/common/dto/paypal";
import { success } from "@lib/common/dto/result";
import { subscriptionService } from "../services/payermax/subscription-service";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import type { PayermaxSubscriptionNotificationPaymentDetail } from "@lib/common/dto/payermax";

const paypal = new Hono();

paypal.post('/event', async (c) => {
    const req = await c.req.json() as PaypalEventReq;
    await paypalEventService.handleEvent(req);
    return c.json(success());
});

paypal.get('/send', async (c) => {
    const userId = c.req.query('userId');
    const pixel = c.req.query('pixel');
    if (!userId || !pixel) {
        return c.json(success());
    }

    const pixelInfo = await pixelDao.getPixelById(Number(pixel));
    subscriptionService.sendFacebookEvent(Number(userId), pixelInfo, {} as PayermaxSubscriptionNotificationPaymentDetail);
    return c.json(success());
});
export default paypal;
