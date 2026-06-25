import type { TikTokEvent } from "@lib/common/consts/pixel";

export interface TikTokBusinessEventReq {
    accessToken: string;
    pixelCode: string;
    event: TikTokEvent;
    eventId: string;
    externalId: string;
    url: string;
}
