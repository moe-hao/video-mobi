import type { CollectionListResp } from "@lib/common/dto/collection";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback, useState, useRef } from "react";

export function useCollection() {
  const [collectionListResp, setCollectionListResp] = useState<CollectionListResp>({} as CollectionListResp);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const currentPageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchCollectionList = useCallback(async (page: number = 1) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const url = `/api/collection/list?page=${page}&size=12`
      const data = await request<CollectionListResp>(url, 'GET');

      if (page === 1) {
        setCollectionListResp(data);
      } else {
        setCollectionListResp(prev => ({
          ...data,
          list: [...(prev.list || []), ...data.list]
        }));
      }

      currentPageRef.current = page;
      setHasMore(data.list.length === data.size);
      loadingRef.current = false;
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingRef.current) {
      const nextPage = currentPageRef.current + 1;
      fetchCollectionList(nextPage);
    }
  }, [hasMore, fetchCollectionList]);

  return {
    collectionListResp,
    fetchCollectionList,
    loadMore,
    loading,
    hasMore,
  }
}
