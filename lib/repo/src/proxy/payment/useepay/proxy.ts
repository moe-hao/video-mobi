import client from "./client";
import type { CreateCustomerReq, CreateCustomerResp, CreateInvoiceReq, CreateInvoiceResp, CreatePaymentIntentReq, CreatePaymentIntentResp, CreateSubscriptionReq, CreateSubscriptionResp, CreateWebhookReq, CreateWebhookResp } from "./types";

class UseePayProxy {
    async createCustomer(req: CreateCustomerReq): Promise<CreateCustomerResp> {
        const result = await client.post<CreateCustomerResp>("/api/v1/customers/create", req);
        return result.data;
    }

    async createSubscription(req: CreateSubscriptionReq): Promise<CreateSubscriptionResp> {
        const result = await client.post<CreateSubscriptionResp>("/api/v1/subscriptions/create", req);
        return result.data;
    }

    async createInvoice(req: CreateInvoiceReq): Promise<CreateInvoiceResp> {
        const result = await client.post<CreateInvoiceResp>("/api/v1/invoices/create", req);
        return result.data;
    }

    async createPaymentIntent(req: CreatePaymentIntentReq): Promise<CreatePaymentIntentResp> {
        client.defaults.headers["x-api-version"] = "2026-04"
        const result = await client.post<CreatePaymentIntentResp>("/api/v1/payment_intents/create", req);
        return result.data;
    }

    async createWebhook(req: CreateWebhookReq): Promise<CreateWebhookResp> {
        const result = await client.post<CreateWebhookResp>("/api/v1/webhooks/create", req);
        return result.data;
    }
}

export const useePayProxy = new UseePayProxy();
