import { logger } from "@lib/internal/logger";
import { exchangeRedis } from "@lib/repo/redis/exchange";

class ExchangeProxy {
    async getExchangeRate(base: string, target: string): Promise<number> {
        const cacheRateData = await exchangeRedis.getExchangeRate(base, target);
        if (cacheRateData) {
            logger.info('ExchangeProxy.getExchangeRate: use cacheRateData');
            return cacheRateData;
        }

        logger.info('ExchangeProxy.getExchangeRate: use api');
        const resp = await fetch(`https://v6.exchangerate-api.com/v6/abfd0efcbdd12f2b49acd998/pair/${base}/${target}`);
        const data = await resp.json();
        exchangeRedis.setExchangeRate(base, target, data.conversion_rate);
        return data.conversion_rate;
    }
}

export const exchangeProxy = new ExchangeProxy();
