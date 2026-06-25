import { currentTime } from "@lib/common/utils/time";
import type { TikTokBusinessEventReq } from "./business.interface";

class TikTokBusinessProxy {
    async sendEvent(req: TikTokBusinessEventReq) {
        await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track', {
            method: 'POST',
            headers: {
                'Authorization': req.accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
        });
    }
}

export const tikTokBusinessProxy = new TikTokBusinessProxy();
