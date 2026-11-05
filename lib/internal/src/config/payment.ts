import { readFile } from "fs/promises";
import { config } from "../base/config";
import { logger } from "../base/logger";

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
        logger.info("host is empty, use default config");
        return paymentConfig["default"].payermax;
    }

    const [configKey] = Object.keys(paymentConfig).filter(key => host.endsWith(key));
    logger.info(`host is ${host}, use config ${configKey}`);
    return paymentConfig[configKey].payermax;
}
