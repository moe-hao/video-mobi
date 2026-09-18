import type { VideoConfigUnlockReq, VideoListReq, VideoListResp } from "@lib/common/dto/video";
import http from "@lib/common/utils/http/manage";
import { convertURLSearchParams } from "@lib/common/utils/param";
import { useCallback, useState } from "react";


export function useVideoState(): {
  videoListPage: VideoListResp;
  fetchVideoList: (req: VideoListReq) => Promise<VideoListResp>;
} {
  const [videoListPage, setVideoListPage] = useState<VideoListResp>({} as VideoListResp);

  const fetchVideoList = useCallback(async (req: VideoListReq) => {
    const urlSearchParams = convertURLSearchParams(req)
    const resp = await http.get<VideoListResp>(`/api/collection_video/list?${urlSearchParams}`);
    setVideoListPage(resp.data);
    return resp.data;
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
    await http.post('/api/collection_video/sync', { collectionId: collectionId });
  }, []);

  return {
    fetchSyncEpisodeVideo,
  };
}

export function useDownloadEpisodeState(): {
  fetchDownloadEpisodeVideo: (collectionId: number) => Promise<void>;
} {
  const fetchDownloadEpisodeVideo = useCallback(async (collectionId: number) => {
    await http.post('/api/collection_video/download_video', { collectionId: collectionId });
  }, []);

  return {
    fetchDownloadEpisodeVideo,
  };
}

export function useConfigUnlockEpisodeState(): {
  fetchConfigUnlockEpisodeVideo: (req: VideoConfigUnlockReq) => Promise<void>;
} {
  const fetchConfigUnlockEpisodeVideo = useCallback(async (req: VideoConfigUnlockReq) => {
    await http.post('/api/collection_video/config_unlock', req);
  }, []);

  return {
    fetchConfigUnlockEpisodeVideo,
  };
}
