export enum OrderStatus {
    Created = 0,
    Pending = 1,
    Paid = 2,
    Completed = 3,
    Failed = 4,
    Closed = 5
}

export const OrderStatusName: Record<OrderStatus, string> = {
    [OrderStatus.Created]: '已创建',
    [OrderStatus.Pending]: '支付中',
    [OrderStatus.Paid]: '已支付',
    [OrderStatus.Completed]: '已完成',
    [OrderStatus.Failed]: '已失败',
    [OrderStatus.Closed]: '已关闭',
}

export const OrderFinalState = [OrderStatus.Completed, OrderStatus.Failed, OrderStatus.Closed];
