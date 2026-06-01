export enum PaymentChannel {
    Payermax = 'payermax',
    Paypal = 'paypal',
}

export enum PaymentType {
    ApplePay = 'APPLEPAY',
    GooglePay = 'GOOGLEPAY',
    Card = 'CARD',
    Paypal = 'paypal',
}

export const PaymentTypeName: Record<PaymentType, string> = {
    [PaymentType.ApplePay]: 'Apple Pay',
    [PaymentType.GooglePay]: 'Google Pay',
    [PaymentType.Card]: '银行卡/信用卡',
    [PaymentType.Paypal]: 'PayPal',
}
