import { logger } from "@lib/internal/logger";
import type { PayssionCreateCustomerMandateReq, PayssionCreateCustomerMandateResp, PayssionCreateCustomerReq, PayssionCreateCustomerResp, PayssionCreateSubscriptionPaymentReq, PayssionCreateSubscriptionPaymentResp, PayssionCreateSubscriptionReq, PayssionCreateSubscriptionResp, PayssionMandateDetailResp, PayssionSubscriptionInfoResp } from "./payssion.interface";
import config from "@lib/internal/config";

class PayssionProxy {
    constructor(
        private readonly baseURL: string = 'https://api.payssion.com/v2',
        private readonly apiKey: string = config.PayssionApiKey
    ) { }

    private async request<RequestType, ResponseType>(method: string, path: string, data?: RequestType): Promise<ResponseType> {
        logger.info(`PayssionProxy.request: ${path}${data ? JSON.stringify(data) : ''}`);
        const resp = await fetch(`${this.baseURL}/${path}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        const result = await resp.json() as ResponseType;
        logger.info(`PayssionProxy.response: ${path} ${JSON.stringify(result)}`);
        return result;
    }

    async createCustomer(req: PayssionCreateCustomerReq): Promise<PayssionCreateCustomerResp> {
        return await this.request<PayssionCreateCustomerReq, PayssionCreateCustomerResp>('POST', 'customers', req);
    }

    async createCustomerMandate(customerId: string, toback: string, unit: string): Promise<PayssionCreateCustomerMandateResp> {
        return await this.request<PayssionCreateCustomerMandateReq, PayssionCreateCustomerMandateResp>('POST', `customers/${customerId}/mandates`, {
            payment_method: 'pix_br',
            return_url: toback,
            payment_method_details: {
                interval_unit: unit,
            }
        });
    }

    async createSubscription(req: PayssionCreateSubscriptionReq): Promise<PayssionCreateSubscriptionResp> {
        return await this.request<PayssionCreateSubscriptionReq, PayssionCreateSubscriptionResp>('POST', 'subscriptions', req);
    }

    async getSubscriptionInfo(subscriptionNo: string): Promise<PayssionSubscriptionInfoResp> {
        return await this.request<void, PayssionSubscriptionInfoResp>('GET', `subscriptions/${subscriptionNo}`);
    }

    async getMandateDetail(mandateId: string): Promise<PayssionMandateDetailResp> {
        return await this.request<void, PayssionMandateDetailResp>('GET', `mandates/${mandateId}`);
    }

    async createPaymentBySubscription(req: PayssionCreateSubscriptionPaymentReq): Promise<PayssionCreateSubscriptionPaymentResp> {
        return await this.request<PayssionCreateSubscriptionPaymentReq, PayssionCreateSubscriptionPaymentResp>('POST', 'payments', req);
    }

    async getSubscriptionPaymentList(subscriptionNo: string): Promise<PayssionSubscriptionInfoResp[]> {
        return await this.request<void, any>('GET', `subscriptions/${subscriptionNo}/payments`);
    }

    async cancelSubscription(subscriptionNo: string): Promise<PayssionSubscriptionInfoResp> {
        return await this.request<void, PayssionSubscriptionInfoResp>('POST', `subscriptions/${subscriptionNo}/cancel`);
    }
}

export const payssionProxy = new PayssionProxy();


// mdt_nH8mH08GiTeHu1mv mdt_vDe9a14OivD00m1a mdt_PKej981u1840vnH4 mdt_nPm9C0uL0ibP9iHa mdt_nzjXjDinX5a9CinD mdt_uz9KWD1CO0KKPyvH mdt_400KeD1OKO8OCGy9 mdt_PyLK4GjDuHqH5GK8 mdt_fvbL804O4aHSb54S
// mdt_u5GWrDLu5WzHmrTm mdt_OCKabDTm5er1fzDG
