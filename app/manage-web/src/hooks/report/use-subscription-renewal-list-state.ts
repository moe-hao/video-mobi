import { useCallback, useState } from "react";
import type { SubscriptionRenewalReportListReq, SubscriptionRenewalReportListResp } from "@lib/common/dto/subscription-renewal-report";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useSubscriptionRenewalListState(): {
  subscriptionRenewalListState: SubscriptionRenewalReportListResp;
  fetchSubscriptionRenewalList: (req: SubscriptionRenewalReportListReq) => Promise<SubscriptionRenewalReportListResp>;
} {
  const [subscriptionRenewalListState, setSubscriptionRenewalListState] = useState<SubscriptionRenewalReportListResp>({} as SubscriptionRenewalReportListResp);
  const fetchSubscriptionRenewalList = useCallback(async (req: SubscriptionRenewalReportListReq) => {
    const resp = await http.get<SubscriptionRenewalReportListResp>(`/api/report/subscription_renewal?${convertURLSearchParams(req)}`);
    setSubscriptionRenewalListState(resp.data);
    return resp.data;
  }, []);

  return {
    subscriptionRenewalListState,
    fetchSubscriptionRenewalList,
  }
}
