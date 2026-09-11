import config from "@lib/internal/config";
import axios from "axios";
import http from "http";
import https from "https";

export const client = axios.create({
    baseURL: "https://la.storage.bunnycdn.com/video-storage-001",
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    timeout: 300000,
    headers: {
        'AccessKey': config.BunnyVideoAccessKey,
    },
});
