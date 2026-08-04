import { useCallback, useState } from "react";
import { convertURLSearchParams } from "@lib/common/utils/param";
import type { SubscriptionListReq, SubscriptionListResp } from "@lib/common/dto/subscription";
import http from "@lib/common/utils/http/manage";

export function useSubscriptionListState(): {
  subscriptionListState: SubscriptionListResp;
  fetchSubscriptionTable: (req: SubscriptionListReq) => Promise<SubscriptionListResp>;
} {
  const [subscriptionListState, setSubscriptionListState] = useState<SubscriptionListResp>({} as SubscriptionListResp);
  const fetchSubscriptionTable = useCallback(async (req: SubscriptionListReq) => {
    const resp = await http.get<SubscriptionListResp>(`/api/subscription/list?${convertURLSearchParams(req)}`);
    setSubscriptionListState(resp.data);
    return resp.data;
  }, []);

  return {
    subscriptionListState,
    fetchSubscriptionTable,
  };
}
