export interface PayssionWebhookReq<DataType = any> {
    type: string;
    data: DataType;
}

export interface PayssionWebhookPaymentData {
    object: {
        id: string;
        source_id: string;
    }
}

export interface PayssionWebhookSubscriptionData {
    object: {
        id: string;
        times_completed: number;
    }
}
