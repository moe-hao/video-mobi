import type { VideoDownloadVodReq, VideoDownloadVodResp } from "@lib/common/dto/video";
import http from "@lib/common/utils/http/manage";
import { useCallback } from "react";

export function useVideoDownload(): {
  fetchDownload(req: VideoDownloadVodReq): Promise<VideoDownloadVodResp>
} {
  const fetchDownload = useCallback(async (req: VideoDownloadVodReq) => {
    const result = await http.post<VideoDownloadVodResp>('/api/collection_video/download', req);
    return result.data;
  }, []);

  return { fetchDownload };
}
