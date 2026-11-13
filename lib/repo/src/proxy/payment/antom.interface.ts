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
