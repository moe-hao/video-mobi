import type { PayssionMandateStatus } from '@lib/common/consts/payment';

export interface PayssionCreateCustomerReq {
    document: PayssionCreateCustomerDocument;
    first_name: string;
    last_name: string;
}

export interface PayssionCreateCustomerDocument {
    country: string;
    type: string;
    number: string;
}

export interface PayssionCreateCustomerResp {
    id: string;
}

export interface PayssionCreateCustomerMandateReq {
    payment_method: string;
    return_url: string;
    payment_method_details: PassionCreateCustomerMandatePaymentMethodDetail;
}

export interface PassionCreateCustomerMandatePaymentMethodDetail {
    interval_unit: string;
}

export interface PayssionCreateCustomerMandateResp {
    id: string;
}

export interface PayssionCreateSubscriptionReq {
    mandate_id: string;
    currency: string;
    amount: string;
    interval_unit: string;
    times: number;
}

export interface PayssionCreateSubscriptionResp {
    id: string;
    mandate: {
        action: {
            redirect_to_url: {
                url: string;
            };
        };
    }
}

export interface PayssionSubscriptionInfoResp {
    id: string;
    mandate_id: string;
    times_completed: number;
    status: string;
    amount: string;
    currency: string;
    time_current_period_start: string;
    time_current_period_end: string;
}

export interface PayssionMandateDetailResp {
    id: string;
    status: PayssionMandateStatus;
    payment_method: string;
}

export interface PayssionCreateSubscriptionPaymentReq {
    payment_method: string;
    currency: string;
    amount: string;
    mandate_id: string;
}

export interface PayssionCreateSubscriptionPaymentResp {
    id: string;
    status: string;
    error: {
        type: string;
        message: string;
    }
}
