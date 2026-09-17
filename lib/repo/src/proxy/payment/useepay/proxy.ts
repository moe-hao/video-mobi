import client from "./client";
import type { CreateCustomerReq, CreateCustomerResp, CreateInvoiceReq, CreateInvoiceResp, CreatePaymentIntentReq, CreatePaymentIntentResp, CreateSubscriptionReq, CreateSubscriptionResp, CreateWebhookReq, CreateWebhookResp } from "./types";

class UseePayProxy {
    async createCustomer(appId: string, req: CreateCustomerReq): Promise<CreateCustomerResp> {
        client.defaults.headers["x-app-id"] = appId;
        const result = await client.post<CreateCustomerResp>("/api/v1/customers/create", req);
        return result.data;
    }

    async createSubscription(appId: string, req: CreateSubscriptionReq): Promise<CreateSubscriptionResp> {
        client.defaults.headers["x-app-id"] = appId;
        const result = await client.post<CreateSubscriptionResp>("/api/v1/subscriptions/create", req);
        return result.data;
    }

    async createInvoice(appId: string, req: CreateInvoiceReq): Promise<CreateInvoiceResp> {
        client.defaults.headers["x-app-id"] = appId;
        const result = await client.post<CreateInvoiceResp>("/api/v1/invoices/create", req);
        return result.data;
    }

    async createPaymentIntent(appId: string, req: CreatePaymentIntentReq): Promise<CreatePaymentIntentResp> {
        client.defaults.headers["x-app-id"] = appId;
        client.defaults.headers["x-api-version"] = "2026-04"
        const result = await client.post<CreatePaymentIntentResp>("/api/v1/payment_intents/create", req);
        return result.data;
    }

    async createWebhook(appId: string, req: CreateWebhookReq): Promise<CreateWebhookResp> {
        client.defaults.headers["x-app-id"] = appId;
        const result = await client.post<CreateWebhookResp>("/api/v1/webhooks/create", req);
        return result.data;
    }
}

export const useePayProxy = new UseePayProxy();
