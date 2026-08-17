import { useCallback, useState } from "react";
import type { ManageUserDetailResp, ManageUserWatchHistoryResp, ManageUserCoinHistoryResp, ManageUserHistoryReq } from "@lib/common/dto/user";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useUserDetail(): {
  userDetailState: ManageUserDetailResp;
  fetchUserDetail: (userId: number) => Promise<ManageUserDetailResp>;
} {
  const [userDetailState, setUserDetailState] = useState<ManageUserDetailResp>({} as ManageUserDetailResp);

  const fetchUserDetail = useCallback(async (userId: number) => {
    const resp = await http.get<ManageUserDetailResp>(`/api/user/detail?userId=${userId}`);
    setUserDetailState(resp.data);
    return resp.data;
  }, []);

  return {
    userDetailState,
    fetchUserDetail,
  };
}

export function useUserWatchHistory(): {
  watchHistoryState: ManageUserWatchHistoryResp;
  fetchWatchHistory: (req: ManageUserHistoryReq) => Promise<ManageUserWatchHistoryResp>;
} {
  const [watchHistoryState, setWatchHistoryState] = useState<ManageUserWatchHistoryResp>({} as ManageUserWatchHistoryResp);

  const fetchWatchHistory = useCallback(async (req: ManageUserHistoryReq) => {
    const resp = await http.get<ManageUserWatchHistoryResp>(`/api/user/watch_history?${convertURLSearchParams(req)}`);
    setWatchHistoryState(resp.data);
    return resp.data;
  }, []);

  return {
    watchHistoryState,
    fetchWatchHistory,
  };
}

export function useUserCoinHistory(): {
  coinHistoryState: ManageUserCoinHistoryResp;
  fetchCoinHistory: (req: ManageUserHistoryReq) => Promise<ManageUserCoinHistoryResp>;
} {
  const [coinHistoryState, setCoinHistoryState] = useState<ManageUserCoinHistoryResp>({} as ManageUserCoinHistoryResp);

  const fetchCoinHistory = useCallback(async (req: ManageUserHistoryReq) => {
    const resp = await http.get<ManageUserCoinHistoryResp>(`/api/user/coin_history?${convertURLSearchParams(req)}`);
    setCoinHistoryState(resp.data);
    return resp.data;
  }, []);

  return {
    coinHistoryState,
    fetchCoinHistory,
  };
}
