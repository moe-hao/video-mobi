import { readFile } from "fs/promises";
import { config } from "../base/config";

export interface PayermaxConfig {
    platformPublicKey: string;
    appId: string;
    merchantNo: string;
};

export interface PaymentChennelConfig {
    payermax: PayermaxConfig;
}

export type PaymentConfig = Record<string, PaymentChennelConfig>;

export async function getPayermaxConfig(host: string): Promise<PayermaxConfig> {
    const fileContent = await readFile(config.PaymentConfigPath, "utf-8");
    const paymentConfig = JSON.parse(fileContent) as PaymentConfig;

    if (!host) {
        return paymentConfig["default"].payermax;
    }

    const [configKey] = Object.keys(paymentConfig).filter(key => host.endsWith(key));
    return paymentConfig[configKey].payermax;
}
