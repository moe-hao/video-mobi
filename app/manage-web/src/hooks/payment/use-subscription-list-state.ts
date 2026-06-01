import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import { convertURLSearchParams } from "@lib/common/utils/param";
import type { SubscriptionListReq, SubscriptionListResp } from "@lib/common/dto/subscription";

export function useSubscriptionListState(): {
  subscriptionListState: SubscriptionListResp;
  fetchSubscriptionTable: (req: SubscriptionListReq) => Promise<SubscriptionListResp>;
} {
  const [subscriptionListState, setSubscriptionListState] = useState<SubscriptionListResp>({} as SubscriptionListResp);
  const fetchSubscriptionTable = useCallback(async (req: SubscriptionListReq) => {
    const subscriptionListResult = await request<SubscriptionListResp>(`/api/subscription/list?${convertURLSearchParams(req)}`, 'GET');
    setSubscriptionListState(subscriptionListResult);

    return subscriptionListResult;
  }, []);

  return {
    subscriptionListState,
    fetchSubscriptionTable,
  };
}
