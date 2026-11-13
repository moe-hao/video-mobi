import { readFile } from "fs/promises";
import { config } from "../base/config";
import { logger } from "../base/logger";

export interface PayermaxConfig {
    platformPublicKey: string;
    appId: string;
    merchantNo: string;
};

export interface AntomConfig {
    clientId: string;
    antomPublicKey: string;
    merchantPrivateKey: string;
}

export interface PaymentChennelConfig {
    payermax: PayermaxConfig;
    antom: AntomConfig;
}

export type PaymentConfig = Record<string, PaymentChennelConfig>;

async function loadPaymentConfig(): Promise<PaymentConfig> {
    const fileContent = await readFile(config.PaymentConfigPath, "utf-8");
    return JSON.parse(fileContent) as PaymentConfig;
}

function resolveConfigKey(paymentConfig: PaymentConfig, host: string): string {
    if (!host) {
        logger.info("host is empty, use default config");
        return "default";
    }

    const configKey = Object.keys(paymentConfig).find(key => host.endsWith(key)) ?? "default";
    logger.info(`host is ${host}, use config ${configKey}`);
    return configKey;
}

export async function getPayermaxConfig(host: string): Promise<PayermaxConfig> {
    const paymentConfig = await loadPaymentConfig();
    return paymentConfig[resolveConfigKey(paymentConfig, host)].payermax;
}

export async function getAntomConfig(host: string): Promise<AntomConfig> {
    const paymentConfig = await loadPaymentConfig();
    return paymentConfig[resolveConfigKey(paymentConfig, host)].antom;
}
