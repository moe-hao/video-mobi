import config from "@lib/internal/config";
import axios from "axios";
import http from "http";
import https from "https";

const library = config.BunnyStreamLibrary;

export const client = axios.create({
    baseURL: `https://video.bunnycdn.com/library/${library}`,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    timeout: 300000,
    headers: {
        'AccessKey': config.BunnyStreamAccessKey,
    },
});
