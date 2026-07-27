import { convertURLSearchParams } from "@lib/common/utils/param";
import type { TikTokBusinessEventReq, TikTokBusinessReportReq } from "./business.interface";
import { logger } from "@lib/internal/logger";

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

    async getReportDataByDate(req: TikTokBusinessReportReq) {
        const accessToken = '943072bd0438cbd7778d491a0fe07943ec3dbc54';

        const resp = await fetch(`${this.baseURL}/report/integrated/get/?${convertURLSearchParams(req)}`, {
            method: 'GET',
            headers: {
                'Access-Token': accessToken,
            },
        });

        const result = await resp.json();
        logger.info(`getReportDataByDate tiktok result: ${JSON.stringify(result)}`);
        return result;
    }
}

export const tikTokBusinessProxy = new TikTokBusinessProxy();

// export interface TikTokBusinessReportReq {
//     advertiser_id: string;
//     report_type: TikTokBusinessReportType;
//     data_level: TikTokBusinessReportDataLevel;
//     dimensions: string[];
//     start_date: string;
//     end_date: string;
//     page: number;
//     page_size: number;
// }

// curl -X GET 'https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/?advertiser_id=7659353009683726343&report_type=BASIC&data_level=AUCTION_AD&dimensions=%5B%22ad_id%22%5D&start_date=2026-07-26&end_date=2026-07-26&page=1&page_size=100' \
// -H 'Access-Token: 943072bd0438cbd7778d491a0fe07943ec3dbc54'


// curl--location - request POST 'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/' \
// --header 'Content-Type: application/json' \
// --data '{
// "app_id": "7664876055001301009",
//     "secret": "b2ab39ec6c2ab591589b39ee7953d06f0b5bd58f",
//         "auth_code": "51338dc6e8896254a4a1b22ee16349f4ac36dc99"
// }'


// 1871221127323650
