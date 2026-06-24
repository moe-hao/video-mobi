import type { VideoDownloadVodReq, VideoDownloadVodResp } from "@lib/common/dto/video";
import { request } from "@lib/common/utils/request-manage";
import { useCallback } from "react";

export function useVideoDownload(): {
  fetchDownload(req: VideoDownloadVodReq): Promise<VideoDownloadVodResp>
} {
  const fetchDownload = useCallback(async (req: VideoDownloadVodReq) => {
    const result = await request<VideoDownloadVodResp>('/api/collection_video/download', 'POST', req);
    return result;
  }, []);

  return { fetchDownload };
}
