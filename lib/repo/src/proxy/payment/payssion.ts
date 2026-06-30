import { logger } from "@lib/internal/logger";
import type { PayssionCreateCustomerMandateReq, PayssionCreateCustomerMandateResp, PayssionCreateCustomerReq, PayssionCreateCustomerResp, PayssionCreateSubscriptionReq, PayssionCreateSubscriptionResp } from "./payssion.interface";
import config from "@lib/internal/config";

class PayssionProxy {
    constructor(
        private readonly baseURL: string = 'https://api.payssion.com/v2',
        private readonly apiKey: string = config.PayssionApiKey
    ) { }

    private async request<RequestType, ResponseType>(path: string, data: RequestType): Promise<ResponseType> {
        logger.info(`PayssionProxy.request: ${path} ${JSON.stringify(data)}`);
        const resp = await fetch(`${this.baseURL}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(data),
        });

        const result = await resp.json() as ResponseType;
        logger.info(`PayssionProxy.response: ${path} ${JSON.stringify(result)}`);
        return result;
    }

    async createCustomer(req: PayssionCreateCustomerReq): Promise<PayssionCreateCustomerResp> {
        return await this.request<PayssionCreateCustomerReq, PayssionCreateCustomerResp>('customers', req);
    }

    async createCustomerMandate(customerId: string, toback: string, unit: string): Promise<PayssionCreateCustomerMandateResp> {
        return await this.request<PayssionCreateCustomerMandateReq, PayssionCreateCustomerMandateResp>(`customers/${customerId}/mandates`, {
            payment_method: 'pix_br',
            return_url: toback,
            payment_method_details: {
                interval_unit: unit,
            }
        });
    }

    async createSubscription(req: PayssionCreateSubscriptionReq): Promise<PayssionCreateSubscriptionResp> {
        return await this.request<PayssionCreateSubscriptionReq, PayssionCreateSubscriptionResp>('subscriptions', req);
    }
}

export const payssionProxy = new PayssionProxy();
