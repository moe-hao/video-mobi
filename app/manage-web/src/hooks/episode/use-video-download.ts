import type { VideoDownloadVodReq } from "@lib/common/dto/video";
import { useCallback } from "react";

export function useVideoDownload(): {
  fetchDownload(req: VideoDownloadVodReq): Promise<void>
} {
  const fetchDownload = useCallback(async (req: VideoDownloadVodReq) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/collection_video/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(req),
    });
    if (!response.ok) {
      throw new Error('Download failed');
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }, []);

  return { fetchDownload };
}
