import { PayermaxSubscriptionStatus } from "./payermax";

export enum SubscriptionStatus {
    InActive = 0, // 未激活
    Active = 1, // 激活成功
    ActiveFailed = 2, // 激活失败
    Expired = 3, // 过期未激活
    Finish = 4, // 订阅完成
    Cancel = 5, // 订阅取消
    Terminate = 6, // 订阅终止
}

export const SubscriptionStatusList = [
    SubscriptionStatus.InActive,
    SubscriptionStatus.Active,
    SubscriptionStatus.ActiveFailed,
    SubscriptionStatus.Expired,
    SubscriptionStatus.Finish,
    SubscriptionStatus.Cancel,
    SubscriptionStatus.Terminate,
];

export const PayermaxToSubscriptionStatus = {
    [PayermaxSubscriptionStatus.InActive]: SubscriptionStatus.InActive,
    [PayermaxSubscriptionStatus.Active]: SubscriptionStatus.Active,
    [PayermaxSubscriptionStatus.ActiveFailed]: SubscriptionStatus.ActiveFailed,
    [PayermaxSubscriptionStatus.Expired]: SubscriptionStatus.Expired,
    [PayermaxSubscriptionStatus.Finish]: SubscriptionStatus.Finish,
    [PayermaxSubscriptionStatus.Cancel]: SubscriptionStatus.Cancel,
    [PayermaxSubscriptionStatus.Terminate]: SubscriptionStatus.Terminate,
}

export const SubscriptionStatusName = {
    [SubscriptionStatus.InActive]: '未激活',
    [SubscriptionStatus.Active]: '已激活',
    [SubscriptionStatus.ActiveFailed]: '已失败',
    [SubscriptionStatus.Expired]: '已过期',
    [SubscriptionStatus.Finish]: '已完成',
    [SubscriptionStatus.Cancel]: '已取消',
    [SubscriptionStatus.Terminate]: '已终止',
}

export const SubscriptionFinalStatus = [
    SubscriptionStatus.ActiveFailed,
    SubscriptionStatus.Expired,
    SubscriptionStatus.Finish,
    SubscriptionStatus.Cancel,
    SubscriptionStatus.Terminate,
];

export enum PeriodType {
    Day = 'D',
    Week = 'W',
    Month = 'M',
    Year = 'Y',
}

export const PeriodTypeToName: Record<PeriodType, string> = {
    [PeriodType.Month]: 'monthly',
    [PeriodType.Day]: 'daily',
    [PeriodType.Week]: 'weekly',
    [PeriodType.Year]: 'yearly',
}
