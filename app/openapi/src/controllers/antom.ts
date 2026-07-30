import { Hono } from "hono";
import type { AntomPaymentNotificationReq } from "@lib/common/dto/antom";
import { receive } from "../services/antom/antom-payment.service";
import { createMiddleware } from "hono/factory";
import { verifySignature } from "../services/antom/signature.service";
import { logger } from "@lib/internal/logger";
import config from "@lib/internal/config";

const antomVerifySign = createMiddleware(async (c, next) => {
    const clientId = config.AntomClientId;
    const body = await c.req.text();
    const signatureHeader = c.req.header('signature') as string;
    const signature = signatureHeader.match(/signature=([^,]+)/)?.[1] ?? '';
    const requestTime = c.req.header('request-time') as string;
    const content = `POST /api/antom/notification\n${clientId}.${requestTime}.${body}`;
    logger.info(`content: ${content}; signature: ${signature}`);

    if (verifySignature(content, signature)) {
        logger.info('antom sign verify success');
        return await next();
    } else {
        logger.error('antom sign verify failed');
        return c.json({ error: 'sign verify failed' }, 400);
    }
})

const antom = new Hono();
antom.use(antomVerifySign);

antom.post('/notification', async (c) => {
    const req = await c.req.json<AntomPaymentNotificationReq>();

    if (req.result.resultCode === 'SUCCESS') {
        await receive(req);
    }

    return c.json({
        result: {
            resultCode: 'SUCCESS',
            resultStatus: 'S',
            resultMessage: 'success',
        }
    });
});

export default antom;
