import type { OrderListReq, OrderListResp } from "@lib/common/dto/order";
import http from "./request";

export function getOrderList(req: OrderListReq) {
  return http.post<OrderListResp>("/api/order/list", req);
}
