import type { SkuListResp } from "@lib/common/dto/sku";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback, useState } from "react";

export function useSkuListState(): {
  skuListRespState: SkuListResp;
  fetchSkuList: () => Promise<SkuListResp>;
} {
  const [skuListRespState, setSkuListRespState] = useState<SkuListResp>({} as SkuListResp);

  const fetchSkuList = useCallback(async () => {
    const data = await request<SkuListResp>('/api/sku/sku_list', 'GET');
    setSkuListRespState(data);
    return data;
  }, []);

  return {
    skuListRespState,
    fetchSkuList,
  }
}
