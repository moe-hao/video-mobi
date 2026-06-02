import type { PaypalEventStatus, PaypalResourceType } from "@lib/common/consts/paypal";

export interface PaypalEventReq<ResourceType = any> {
    id: string;
    event_type: string;
    resource_type: PaypalResourceType;
    status: PaypalEventStatus;
    resource: ResourceType;
}

export interface PaypalEventReourceSubscription {
    id: string;
    status: string;
    custom_id: string;
}


export interface PaypalEventReourceSale {
    id: string;
    state: string;
    custom: string;
    billing_agreement_id: string;
    amount: PaypalEventReourceSaleAmount;
}

export interface PaypalEventReourceSaleAmount {
    total: string;
    currency: string;
}
