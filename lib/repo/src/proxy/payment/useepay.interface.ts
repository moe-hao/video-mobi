export interface UseePayCreateCustomerRequest {
    merchant_customer_id: string;
    name: string;
    email: string;
}

export interface UseePayCreateCustomerResponse {
    id: string;
}

export interface UseePayCreateSubscriptionRequest {
    customer_id: string;
    recurring: UseePayCreateSubscriptionRecurring;
    currency: string;
    current_period_start: string;
}

export interface UseePayCreateSubscriptionRecurring {
    interval: string;
    unit_amount: string;
    interval_count: number;
    total_billing_cycles: number;
}

export interface UseePayCreateSubscriptionResponse {
    id: string;
    payment_intent: {
        invoice_id: string
    }
}

export interface UseePayCreatePaymentIntentRequest {
    merchant_order_id: string;
    amount: string;
    currency: string;
    customer_id: string;
    confirm: boolean;
    auto_capture: boolean;
    mode: "payment" | "subscription";
    return_url: string;
    payment_method_data: {
        type: string;
        fisrt_name: string;
        last_name: string;
        billing: {
            address: {
                country: string;
            }
        }
        pix?: {
            identification_number: string;
        }
    },
    device_data: {
        ip_address: string
    }
}

export interface UseePayCreatePaymentIntentResponse {
    id: string;
    next_action: {
        type: string;
        redirect: {
            method: string;
            url: string;
        }
    }
}
