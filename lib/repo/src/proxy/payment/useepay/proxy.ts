import { config } from "@lib/internal/base/config";
import type { CreateCustomerReq, CreateCustomerResp, CreateInvoiceReq, CreateInvoiceResp, CreatePaymentIntentReq, CreatePaymentIntentResp, CreateSubscriptionReq, CreateSubscriptionResp, CreateWebhookReq, CreateWebhookResp } from "./types.ts";
import { camelCase, snakeCase } from "change-case/keys";
import { logger } from "@lib/internal/base/logger";

type UseePayRequestConfig = {
    path: string;
    method: string;
    appId?: string;
    apiVersion?: string;
    body?: any;
};

class UseePayProxy {
    private baseURL: string = config.UseePayBaseURL;

    private async request<ResponseType>(requestConfig: UseePayRequestConfig): Promise<ResponseType> {
        const headers: HeadersInit = {
            "content-type": "application/json",
            "x-merchant-no": config.UseePayMerchantNo,
            "x-api-key": config.UseePayApiKey,
            "x-app-id": requestConfig.appId || config.UseePayAppId,
        };

        if (requestConfig.apiVersion) {
            headers["x-api-version"] = requestConfig.apiVersion;
        }

        const requestBody = JSON.stringify(snakeCase(requestConfig.body, Infinity));
        logger.info("useepay request path: %s, method: %s, appId: %s, apiVersion: %s, body: %s", requestConfig.path, requestConfig.method, requestConfig.appId, requestConfig.apiVersion, requestBody);

        const response = await fetch(`${this.baseURL}${requestConfig.path}`, {
            method: requestConfig.method,
            headers: headers,
            body: requestBody,
        });


        const result = camelCase(await response.json()) as ResponseType;
        logger.info("useepay response body: %s", JSON.stringify(result));
        return result;
    }

    async createCustomer(appId: string, req: CreateCustomerReq): Promise<CreateCustomerResp> {
        return await this.request<CreateCustomerResp>({
            path: "/api/v1/customers/create",
            method: "POST",
            appId: appId,
            body: req,
        });
    }

    async createSubscription(appId: string, req: CreateSubscriptionReq): Promise<CreateSubscriptionResp> {
        return await this.request<CreateSubscriptionResp>({
            path: "/api/v1/subscriptions/create",
            method: "POST",
            appId: appId,
            body: req,
        });
    }

    async createInvoice(appId: string, req: CreateInvoiceReq): Promise<CreateInvoiceResp> {
        return await this.request<CreateInvoiceResp>({
            path: "/api/v1/invoices/create",
            method: "POST",
            appId: appId,
            body: req,
        });
    }

    async createPaymentIntent(appId: string, req: CreatePaymentIntentReq): Promise<CreatePaymentIntentResp> {
        return await this.request<CreatePaymentIntentResp>({
            path: "/api/v1/payment_intents/create",
            method: "POST",
            appId: appId,
            apiVersion: "2026-04",
            body: req,
        });
    }

    async createWebhook(appId: string, req: CreateWebhookReq): Promise<CreateWebhookResp> {
        return await this.request<CreateWebhookResp>({
            path: "/api/v1/webhooks/create",
            method: "POST",
            appId: appId,
            body: req,
        });
    }
}

export const useePayProxy = new UseePayProxy();
