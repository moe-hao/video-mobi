import config from "../config";
import { TosClient } from '@volcengine/tos-sdk';

export const tos = new TosClient({
    accessKeyId: config.VolAccessKeyId,
    accessKeySecret: config.VolSecretKey,
    region: config.VolRegion,
    endpoint: config.VolTosEndpoint,
});
