import { OrderStatus } from "./order";

export enum PayermaxResponseCode {
    Success = 'SUCCESS',
    ApplySuccess = 'APPLY_SUCCESS'
}

export enum PayermaxOrderStatus {
    Pending = 'PENDING',
    Success = 'SUCCESS',
    Failed = 'FAILED',
    Closed = 'CLOSED',
}

export const PayermaxResultToStatus: Record<PayermaxOrderStatus, OrderStatus> = {
    [PayermaxOrderStatus.Pending]: OrderStatus.Pending,
    [PayermaxOrderStatus.Success]: OrderStatus.Paid,
    [PayermaxOrderStatus.Failed]: OrderStatus.Failed,
    [PayermaxOrderStatus.Closed]: OrderStatus.Closed,
}

export enum PayermaxNotifyType {
    Payment = 'PAYMENT',
    Subscription = 'SUBSCRIPTION',
    SubscriptionPayment = 'SUBSCRIPTION_PAYMENT',
}

export enum PayermaxSubscriptionStatus {
    InActive = 'INACTIVE', // 未激活
    Active = 'ACTIVE', // 激活成功
    ActiveFailed = 'ACTIVE_FAILED', // 激活失败
    Expired = 'EXPIRED', // 过期未激活
    Finish = 'FINISH', // 订阅完成
    Cancel = 'CANCEL', // 订阅取消
    Terminate = 'TERMINATE', // 订阅终止
}
