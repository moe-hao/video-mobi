import type { VideoPlayInfoResp } from "@lib/common/dto/video";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback, useState } from "react";

export function useCollectionVideo(): {
  videoPlayInfoResp: VideoPlayInfoResp;
  fetchVideoPlayInfo: (collectionBizId: string, epNum: number) => Promise<VideoPlayInfoResp>;
} {
  const [videoPlayInfoResp, setVideoPlayInfoResp] = useState<VideoPlayInfoResp>({} as VideoPlayInfoResp);

  const fetchVideoPlayInfo = useCallback(async (collectionBizId: string, epNum: number) => {
    const url = `/api/video/play_info?collectionBizId=${collectionBizId}&epNum=${epNum}`
    const data = await request<VideoPlayInfoResp>(url, 'GET');
    setVideoPlayInfoResp(data);
    return data;
  }, [])

  return {
    videoPlayInfoResp,
    fetchVideoPlayInfo,
  }
}
