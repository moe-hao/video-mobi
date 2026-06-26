import type { TikTokBusinessEventReq } from "./business.interface";
import { logger } from "@lib/internal/logger";

class TikTokBusinessProxy {
    async sendEvent(accessToken: string, req: TikTokBusinessEventReq) {
        try {
            const url = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'
            const data = JSON.stringify(req);

            logger.info(`sendEvent tiktok url: ${url}, data: ${data}`);
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Access-Token': accessToken,
                    'Content-Type': 'application/json',
                },
                body: data,
            });

            const result = await resp.json();
            logger.info(`sendEvent tiktok result: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`sendEvent tiktok error: ${JSON.stringify(error)}`);
        }
    }
}

export const tikTokBusinessProxy = new TikTokBusinessProxy();
