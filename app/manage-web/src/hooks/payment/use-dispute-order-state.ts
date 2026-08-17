import { useCallback, useState } from "react";
import type { DisputeOrderReq, DisputeOrderResp } from "@lib/common/dto/order";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useDisputeOrderState(): {
  disputeOrderState: DisputeOrderResp;
  fetchDisputeOrderInfo: (req: DisputeOrderReq) => Promise<DisputeOrderResp>;
} {
  const [disputeOrderState, setDisputeOrderState] = useState<DisputeOrderResp>({} as DisputeOrderResp);
  const fetchDisputeOrderInfo = useCallback(async (req: DisputeOrderReq) => {
    const resp = await http.get<DisputeOrderResp>(`/api/order/dispute_order?${convertURLSearchParams(req)}`);
    setDisputeOrderState(resp.data);
    return resp.data;
  }, []);

  return {
    disputeOrderState,
    fetchDisputeOrderInfo,
  }
}
