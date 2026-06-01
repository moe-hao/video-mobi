import type { OrderApproveReq, OrderCloseReq, OrderCreateReq, OrderCreateResp } from "@lib/common/dto/order";
import { request } from "@lib/common/utils/request-mobi";
import { useState } from "react";

export function useUserOrderCreate(): {
  userOrderCreateState: OrderCreateResp;
  fetchUserOrderCreate: (body: OrderCreateReq) => Promise<OrderCreateResp>;
} {
  const [userOrderCreateState, setUserOrderCreateState] = useState<OrderCreateResp>({} as OrderCreateResp);

  const fetchUserOrderCreate = async (body: OrderCreateReq) => {
    const result = await request<OrderCreateResp>('/api/order/create', 'POST', body);
    setUserOrderCreateState(result);
    return result;
  }

  return {
    userOrderCreateState,
    fetchUserOrderCreate,
  }
}

export function useUserOrderApprove(): {
  fetchUserOrderApprove: (body: OrderApproveReq) => Promise<void>;
} {
  const fetchUserOrderApprove = async (body: OrderApproveReq) => {
    await request<void>('/api/order/approve', 'POST', body);
  }

  return {
    fetchUserOrderApprove,
  }
}

export function useUserOrderClose(): {
  fetchUserOrderClose: (body: OrderCloseReq) => Promise<void>;
} {
  const fetchUserOrderClose = async (body: OrderCloseReq) => {
    await request<void>('/api/order/close', 'POST', body);
  }

  return {
    fetchUserOrderClose,
  }
}
