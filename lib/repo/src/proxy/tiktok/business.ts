import { convertURLSearchParams } from "@lib/common/utils/param";
import type { TikTokBusinessEventReq, TikTokBusinessReportReq, TikTokBusinessReportResp } from "./business.interface";
import { logger } from "@lib/internal/logger";
import config from "@lib/internal/config";

class TikTokBusinessProxy {
    constructor(
        private readonly baseURL: string = 'https://business-api.tiktok.com/open_api/v1.3',
    ) { }

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

    async getReportDataByDate(req: TikTokBusinessReportReq): Promise<TikTokBusinessReportResp> {
        const resp = await fetch(`${this.baseURL}/report/integrated/get/?${convertURLSearchParams(req)}`, {
            method: 'GET',
            headers: {
                'Access-Token': config.TikTokBusinessAccessToken,
            },
        });

        const result = await resp.json() as TikTokBusinessReportResp;
        logger.info(`getReportDataByDate tiktok result: ${JSON.stringify(result)}`);
        return result;
    }
}

export const tikTokBusinessProxy = new TikTokBusinessProxy();
