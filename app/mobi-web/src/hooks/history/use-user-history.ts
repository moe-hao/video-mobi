import type { CollectionHistoryReq, CollectionHistoryResp } from "@lib/common/dto/history";
import { convertURLSearchParams } from "@lib/common/utils/param";
import { request } from "@lib/common/utils/request-mobi";
import { useState } from "react";

export function useUserCollectionHistory(): {
  collectionHistory: CollectionHistoryResp;
  fetchCollectionHistory: (req: CollectionHistoryReq) => Promise<CollectionHistoryResp>;
} {
  const [collectionHistory, setCollectionHistory] = useState<CollectionHistoryResp>({
    epNum: 1,
  });
  const fetchCollectionHistory = async (req: CollectionHistoryReq) => {
    const result = await request<CollectionHistoryResp>(`/api/history/collection_history?${convertURLSearchParams(req)}`, "GET");
    setCollectionHistory(result);
    return result;
  }

  return {
    collectionHistory,
    fetchCollectionHistory,
  }
}
