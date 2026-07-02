import type { VideoConfigUnlockReq, VideoListReq, VideoListResp } from "@lib/common/dto/video";
import { convertURLSearchParams } from "@lib/common/utils/param";
import { request } from "@lib/common/utils/request-manage";
import { useCallback, useState } from "react";


export function useVideoState(): {
  videoListPage: VideoListResp;
  fetchVideoList: (req: VideoListReq) => Promise<VideoListResp>;
} {
  const [videoListPage, setVideoListPage] = useState<VideoListResp>({} as VideoListResp);

  const fetchVideoList = useCallback(async (req: VideoListReq) => {
    const urlSearchParams = convertURLSearchParams(req)
    const resp = await request<VideoListResp>(`/api/collection_video/list?${urlSearchParams}`, 'GET');
    setVideoListPage(resp);
    return resp;
  }, []);

  return {
    videoListPage,
    fetchVideoList,
  };
}

export function useEpisodeVideoState(): {
  fetchSyncEpisodeVideo: (collectionId: number) => Promise<void>;
} {
  const fetchSyncEpisodeVideo = useCallback(async (collectionId: number) => {
    await request('/api/collection_video/sync', 'POST', { collectionId: collectionId });
  }, []);

  return {
    fetchSyncEpisodeVideo,
  };
}

export function useDownloadEpisodeState(): {
  fetchDownloadEpisodeVideo: (collectionId: number) => Promise<void>;
} {
  const fetchDownloadEpisodeVideo = useCallback(async (collectionId: number) => {
    await request('/api/collection_video/download_video', 'POST', { collectionId: collectionId });
  }, []);

  return {
    fetchDownloadEpisodeVideo,
  };
}

export function useConfigUnlockEpisodeState(): {
  fetchConfigUnlockEpisodeVideo: (req: VideoConfigUnlockReq) => Promise<void>;
} {
  const fetchConfigUnlockEpisodeVideo = useCallback(async (req: VideoConfigUnlockReq) => {
    await request('/api/collection_video/config_unlock', 'POST', req);
  }, []);

  return {
    fetchConfigUnlockEpisodeVideo,
  };
}
