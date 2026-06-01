import { OrderStatus } from "@lib/common/consts/order";

export default function OrderStatusPoint({ orderStatus, orderStatusName }: { orderStatus: OrderStatus, orderStatusName: string }) {
  switch (orderStatus) {
    case OrderStatus.Created:
      return (
        <span className="inline-flex items-center gap-1" >
          <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
          {orderStatusName}
        </span>
      );
    case OrderStatus.Pending:
      return (
        <span className="inline-flex items-center gap-1" >
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          {orderStatusName}
        </span>
      );
    case OrderStatus.Paid:
      return (
        <span className="inline-flex items-center gap-1" >
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          {orderStatusName}
        </span>
      );
    case OrderStatus.Completed:
      return (
        <span className="inline-flex items-center gap-1" >
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {orderStatusName}
        </span>
      );
    case OrderStatus.Failed:
      return (
        <span className="inline-flex items-center gap-1" >
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          {orderStatusName}
        </span>
      );
    case OrderStatus.Closed:
      return (
        <span className="inline-flex items-center gap-1" >
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          {orderStatusName}
        </span>
      );
    default:
      return orderStatusName;
  }
}
