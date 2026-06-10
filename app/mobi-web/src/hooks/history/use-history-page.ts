import { request } from "@lib/common/utils/request-mobi";
import type { UserHistoryListResp } from "@lib/common/dto/history/history";
import { useCallback, useRef, useState } from "react";
import type { HistoryDeleteReq, UserHistoryListReq } from "@lib/common/dto/history";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useHistoryPage(): {
  historyUserList: UserHistoryListResp;
  loading: boolean;
  hasMore: boolean;
  fetchHistoryList: (req: UserHistoryListReq) => Promise<UserHistoryListResp>;
  fetchMore: () => Promise<void>;
} {
  const [historyUserList, setHistoryUserList] = useState<UserHistoryListResp>({} as UserHistoryListResp);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1);
  const sizeRef = useRef(10);
  const totalRef = useRef(0);

  const hasMore = historyUserList.list ? historyUserList.list.length < totalRef.current : true;

  const fetchHistoryList = useCallback(async (req: UserHistoryListReq) => {
    setLoading(true);
    pageRef.current = req.page || 1;
    sizeRef.current = req.size || 10;
    const result = await request<UserHistoryListResp>(`/api/history/user_history_list?${convertURLSearchParams(req)}`, "GET");
    totalRef.current = result.total;
    setHistoryUserList(result);
    setLoading(false);
    return result;
  }, []);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = pageRef.current + 1;
    const req: UserHistoryListReq = { page: nextPage, size: sizeRef.current };
    const result = await request<UserHistoryListResp>(`/api/history/user_history_list?${convertURLSearchParams(req)}`, "GET");
    totalRef.current = result.total;
    setHistoryUserList(prev => ({
      ...result,
      list: [...(prev.list || []), ...result.list],
    }));
    pageRef.current = nextPage;
    setLoading(false);
  }, [loading, hasMore]);

  return {
    historyUserList,
    loading,
    hasMore,
    fetchHistoryList,
    fetchMore,
  };
}


export function useDeleteHistoryItem(): {
  fetchDeleteHistoryItem: (req: HistoryDeleteReq) => Promise<void>;
} {
  const fetchDeleteHistoryItem = async (req: HistoryDeleteReq) => {
    await request<void>("/api/history/delete", "POST", req);
  };

  return {
    fetchDeleteHistoryItem,
  };
}
