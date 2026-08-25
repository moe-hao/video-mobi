import http from "@lib/internal/http";
import { logger } from "@lib/internal/logger";
import { exchangeRedis } from "@lib/repo/redis/exchange";

class ExchangeProxy {
    async getExchangeRate(base: string, target: string): Promise<number> {
        const cacheRateData = await exchangeRedis.getExchangeRate(base, target);
        if (cacheRateData) {
            logger.info('ExchangeProxy.getExchangeRate: use cacheRateData');
            return cacheRateData;
        }

        logger.info(`ExchangeProxy.getExchangeRate: use api, ${base} -> ${target}`);
        const result = await http.get<{ conversion_rate: number }>(`https://v6.exchangerate-api.com/v6/abfd0efcbdd12f2b49acd998/pair/${base}/${target}`);

        await exchangeRedis.setExchangeRate(base, target, result.data.conversion_rate);
        return result.data.conversion_rate;
    }
}

export const exchangeProxy = new ExchangeProxy();
