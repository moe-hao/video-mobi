import { logger } from "@lib/internal/logger";
import type { FacebookEventReq } from "./facebook.interface";

class FacebookProxy {
    async sendEvent(pixelId: string, req: FacebookEventReq) {
        try {
            const url = `https://graph.facebook.com/v24.0/${pixelId}/events?access_token=${req.access_token}`;
            const data = JSON.stringify(req);

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
            });

            const result = await resp.json();
            logger.info(`send event to facebook success, result: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`send event to facebook error, error: ${JSON.stringify(error)}`);
        }
    }
}

export const facebookProxy = new FacebookProxy();
