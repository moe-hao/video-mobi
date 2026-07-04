import type { VideoLikeReq, VideoLikeResp, VideoPlayInfoResp, VideoUnlockCoinReq, VideoUnlockCoinResp } from "@lib/common/dto/video";
import { convertURLSearchParams } from "@lib/common/utils/param";
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

export function useLike(): {
  fetchLike: (req: VideoLikeReq) => Promise<void>
} {
  const fetchLike = useCallback(async (req: VideoLikeReq) => {
    const url = `/api/video/like?${convertURLSearchParams(req)}`
    await request<void>(url, 'GET');
  }, [])

  return {
    fetchLike,
  }
}

export function useLikeStatus(): {
  likeResp: VideoLikeResp;
  fetchLikeStatus: (req: VideoLikeReq) => Promise<VideoLikeResp>
} {
  const [likeResp, setLikeResp] = useState<VideoLikeResp>({} as VideoLikeResp);

  const fetchLikeStatus = useCallback(async (req: VideoLikeReq) => {
    const url = `/api/video/like_status?${convertURLSearchParams(req)}`
    const data = await request<VideoLikeResp>(url, 'GET');
    setLikeResp(data);
    return data;
  }, [])

  return {
    likeResp,
    fetchLikeStatus,
  }
}

export function useUnlockCoin(): {
  fetchUnlockCoin: (req: VideoUnlockCoinReq) => Promise<VideoUnlockCoinResp>
} {
  const fetchUnlockCoin = useCallback(async (req: VideoUnlockCoinReq) => {
    const result = await request<VideoUnlockCoinResp>(`/api/video/unlock_coin`, 'POST', req);
    return result;
  }, [])

  return {
    fetchUnlockCoin,
  }
}
