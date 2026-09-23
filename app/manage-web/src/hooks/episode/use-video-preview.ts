import type { VideoPreviewReq, VideoPreviewResp } from "@lib/common/dto/video.schema";
import http from "@lib/common/utils/http/manage";
import { useCallback } from "react";

export function useVideoPreview(): {
  fetchPreview(req: VideoPreviewReq): Promise<VideoPreviewResp>
} {
  const fetchPreview = useCallback(async (req: VideoPreviewReq) => {
    const result = await http.post<VideoPreviewResp>('/api/collection_video/preview', req);
    return result.data;
  }, []);

  return { fetchPreview };
}
