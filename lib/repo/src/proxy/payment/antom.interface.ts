export interface CreateSubscriptionResp {
    normalUrl: string,
}

export interface CancelSubscriptionResp {
    result: {
        resultCode: string,
        resultStatus: string,
        resultMessage: string,
    }
}

export interface GetExchangeRateResp {
    paymentQuotes: {
        exchangeRate: number,
    }[],
    result: {
        resultCode: string,
    }
}
