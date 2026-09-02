import { PeriodType } from "@lib/common/consts/subscription";
import type { UseePayCreateCustomerRequest, UseePayCreateCustomerResponse, UseePayCreatePaymentIntentRequest, UseePayCreatePaymentIntentResponse, UseePayCreateSubscriptionRequest, UseePayCreateSubscriptionResponse } from "./useepay.interface";
import { logger } from "@lib/internal/logger";
import http from "@lib/internal/http";
import config from "@lib/internal/config";

class UseePayProxy {
    constructor(
        private readonly request = http,
        private readonly baseURL = config.UseePayBaseURL,
        private readonly headers = {
            "x-merchant-no": config.UseePayMerchantNo,
            "x-api-key": config.UseePayApiKey,
            "x-app-id": config.UseePayAppId,
        }
    ) { }

    async createCustomer(body: UseePayCreateCustomerRequest): Promise<UseePayCreateCustomerResponse> {
        logger.info(`UseePay createCustomer: ${JSON.stringify(body)}`);
        const result = await this.request.post<UseePayCreateCustomerResponse>(`${this.baseURL}/api/v1/customers/create`, body, {
            headers: this.headers,
        });
        logger.info(`UseePay createCustomer: ${JSON.stringify(result.status)}`);
        return result.data;
    }

    async createSubscription(body: UseePayCreateSubscriptionRequest): Promise<UseePayCreateSubscriptionResponse> {
        logger.info(`UseePay createSubscription: ${JSON.stringify(body)}`);
        const result = await this.request.post<UseePayCreateSubscriptionResponse>(`${this.baseURL}/api/v1/subscriptions/create`, body, {
            headers: this.headers,
        });
        logger.info(`UseePay createSubscription: ${JSON.stringify(result.status)}`);
        return result.data;
    }

    async createPaymentIntent(body: UseePayCreatePaymentIntentRequest): Promise<UseePayCreatePaymentIntentResponse> {
        logger.info(`UseePay createPaymentIntent: ${JSON.stringify(body)}`);
        const result = await this.request.post<UseePayCreatePaymentIntentResponse>(`${this.baseURL}/api/v1/payment_intents/create`, body, {
            headers: this.headers,
        });
        logger.info(`UseePay createPaymentIntent: ${JSON.stringify(result.data)}`);
        return result.data;
    }
}

export const useePayProxy = new UseePayProxy();

export function getUseePaySubscriptionInterval(periodType: PeriodType): string {
    switch (periodType) {
        case PeriodType.Day:
            return 'day';
        case PeriodType.Week:
            return 'week';
        case PeriodType.Month:
            return 'month';
        case PeriodType.Year:
            return 'year';
    }
}
