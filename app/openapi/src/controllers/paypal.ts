import { Hono } from "hono";
import { paypalEventService } from "../services/paypal/paypal-event-service";
import type { PaypalEventReq } from "@lib/common/dto/paypal";
import { success } from "@lib/common/dto/result";
import { subscriptionService } from "../services/payermax/subscription-service";
import { pixelDao } from "@lib/repo/dao/pixel.dao";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";

const paypal = new Hono();

paypal.post('/event', async (c) => {
    const req = await c.req.json() as PaypalEventReq;
    await paypalEventService.handleEvent(req);
    return c.json(success());
});

paypal.get('/send', async (c) => {
    const subscriptionId = c.req.query('subscriptionId');
    const pixel = c.req.query('pixel');
    if (!subscriptionId || !pixel) {
        return c.json(success());
    }

    const pixelInfo = await pixelDao.getPixelById(Number(pixel));
    const subscriptionInfo = await subscriptionDao.getSubscriptionById(Number(subscriptionId));

    subscriptionService.sendFacebookEvent(pixelInfo, subscriptionInfo);
    return c.json(success());
});

export default paypal;
