import axios from 'axios';
import https from 'https';
import http from 'http';
import config from "@lib/internal/config";
import { PeriodType } from "@lib/common/consts/subscription";
import { logger } from "@lib/internal/logger";
import {
    createCustomerDataSchema,
    createCustomerResultSchema,
    createPaymentIntentDataSchema,
    createPaymentIntentResultSchema,
    createSubscriptionDataSchema,
    createSubscriptionRespSchema,
    type CreateCustomerDataInner,
    type CreateCustomerResultInner,
    type CreateCustomerResultOuter,
    type CreatePaymentIntentDataInner,
    type CreatePaymentIntentResultInner,
    type CreatePaymentIntentResultOuter,
    type CreateSubscriptionDataInner,
    type CreateSubscriptionResultInner,
    type CreateSubscriptionResultOuter,
} from "./schema/useepay";

const client = axios.create({
    baseURL: config.UseePayBaseURL,
    httpsAgent: new https.Agent({ keepAlive: true }),
    httpAgent: new http.Agent({ keepAlive: true }),
    timeout: 30000,
    headers: {
        "x-merchant-no": config.UseePayMerchantNo,
        "x-api-key": config.UseePayApiKey,
        "x-app-id": config.UseePayAppId,
    },
});

client.interceptors.request.use(request => {
    logger.info(`UseePay request: [url] ${request.url} [body] ${JSON.stringify(request.data)}`);
    return request;
});

client.interceptors.response.use(response => {
    logger.info(`UseePay response: [url] ${response.config.url} [status] ${response.status} [result] ${JSON.stringify(response.data)}`);
    return response;
});


class UseePayProxy {
    async createCustomer(data: CreateCustomerDataInner): Promise<CreateCustomerResultInner> {
        const resp = await client.post<CreateCustomerResultOuter>(
            "/api/v1/customers/create",
            createCustomerDataSchema.to(data)
        );

        const reuslt = createCustomerResultSchema.from(resp.data);
        return reuslt;
    }

    async createSubscription(data: CreateSubscriptionDataInner): Promise<CreateSubscriptionResultInner> {
        const result = await client.post<CreateSubscriptionResultOuter>(
            "/api/v1/subscriptions/create",
            createSubscriptionDataSchema.to(data)
        );
        return createSubscriptionRespSchema.from(result.data);
    }

    async createPaymentIntent(data: CreatePaymentIntentDataInner): Promise<CreatePaymentIntentResultInner> {
        const result = await client.post<CreatePaymentIntentResultOuter>(
            "/api/v1/payment_intents/create",
            createPaymentIntentDataSchema.to(data)
        );
        return createPaymentIntentResultSchema.from(result.data);
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
