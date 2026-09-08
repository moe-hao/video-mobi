import config from "@lib/internal/config";
import { logger } from "@lib/internal/logger";
import axios from "axios";
import https from "https";
import http from "http";
import { camelCase, snakeCase } from "change-case/keys";

const client = axios.create({
    baseURL: config.UseePayBaseURL,
    httpsAgent: new https.Agent({ keepAlive: true }),
    httpAgent: new http.Agent({ keepAlive: true }),
    timeout: 30000,
    headers: {
        "x-merchant-no": config.UseePayMerchantNo,
        "x-api-key": config.UseePayApiKey,
        "x-app-id": config.UseePayAppId,
    },
});

client.interceptors.request.use((request) => {
    request.data = snakeCase(request.data, Infinity);
    logger.info(`UseePay request: [url] ${request.url} [body] ${JSON.stringify(request.data)}`);
    return request;
});

client.interceptors.response.use((response) => {
    response.data = camelCase(response.data, Infinity);
    logger.info(`UseePay response: [url] ${response.config.url} [status] ${response.status} [result] ${JSON.stringify(response.data)}`);
    return response;
});

export default client;
