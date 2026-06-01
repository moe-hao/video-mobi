import type { CollectionItemResp } from "@lib/common/dto/collection";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback, useState } from "react";

export function useFeatureCollection() {
  const [featuredList, setFeaturedList] = useState<CollectionItemResp[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFeaturedCollections = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/collection/feature`
      const data = await request<CollectionItemResp[]>(url, 'GET');
      setFeaturedList(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    featuredList,
    fetchFeaturedCollections,
    loading,
  }
}
