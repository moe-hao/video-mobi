import { useCallback, useState } from "react";
import type { OrderListReq, OrderListResp } from "@lib/common/dto/order";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useOrderListState(): {
  orderListState: OrderListResp;
  fetchOrderList: (req: OrderListReq) => Promise<OrderListResp>;
} {
  const [orderListState, setOrderListState] = useState<OrderListResp>({} as OrderListResp);
  const fetchOrderList = useCallback(async (req: OrderListReq) => {
    const resp = await http.get<OrderListResp>(`/api/order/list?${convertURLSearchParams(req)}`);
    setOrderListState(resp.data);
    return resp.data;
  }, []);

  return {
    orderListState,
    fetchOrderList,
  }
}
