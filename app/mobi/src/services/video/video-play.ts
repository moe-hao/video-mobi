import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { vod } from "@lib/internal/volcengine/openapi";

export async function getVolVideoPlayURL(vid: string): Promise<string> {
    const playInfo = await vod.GetPlayInfo({ Vid: vid });
    const [videoInfo] = playInfo.Result?.PlayInfoList || [];
    if (!videoInfo) {
        throw new InternalException(ResultCode.ResourceNotFound.code, 'Video Not Found');
    }

    return videoInfo.MainPlayUrl.replace('http://video.bluearcshow.com', 'https://s02.bluearcshow.com');
}

export function getTosVideoPlayURL(collectionBizId: string, vid: string): string {
    return `https://s05.bluearcshow.com/${collectionBizId}/${vid}`;
}
