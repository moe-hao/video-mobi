import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { OrderListReq, OrderListResp } from "@lib/common/dto/order";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useOrderListState(): {
  orderListState: OrderListResp;
  fetchOrderList: (req: OrderListReq) => Promise<OrderListResp>;
} {
  const [orderListState, setOrderListState] = useState<OrderListResp>({} as OrderListResp);
  const fetchOrderList = useCallback(async (req: OrderListReq) => {
    const orderListResult = await request<OrderListResp>(`/api/order/list?${convertURLSearchParams(req)}`, 'GET');
    setOrderListState(orderListResult);
    return orderListResult;
  }, []);

  return {
    orderListState,
    fetchOrderList,
  }
}
