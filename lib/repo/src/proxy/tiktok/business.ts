import { currentTime } from "@lib/common/utils/time";
import type { TikTokBusinessEventReq } from "./business.interface";
import { logger } from "@lib/internal/logger";

class TikTokBusinessProxy {
    async sendEvent(req: TikTokBusinessEventReq) {
        logger.info(`sendEvent toiktok: ${JSON.stringify(req)}`);
        const body = JSON.stringify({
            event_source: 'web',
            event_source_id: req.pixelCode,
            data: [{
                event: req.event,
                event_time: currentTime(),
                event_id: req.eventId,
                user: {
                    external_id: req.externalId,
                },
                page: {
                    url: req.url,
                }
            }]
        })
        logger.info(`sendEvent toiktok body: ${JSON.stringify(body)}`);

        try {
            const resp = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
                method: 'POST',
                headers: {
                    'Access-Token': req.accessToken,
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await resp.json();
            logger.info(`sendEvent toiktok: ${JSON.stringify(data)}`);
        } catch (error) {
            logger.error(`sendEvent toiktok error: ${JSON.stringify(error)}`);
        }
    }
}

export const tikTokBusinessProxy = new TikTokBusinessProxy();
