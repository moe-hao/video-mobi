import { TosClient } from "@volcengine/tos-sdk";
import config from "../config";

export const tos = new TosClient({
    accessKeyId: config.VolAccessKeyId,
    accessKeySecret: config.VolSecretKey,
    region: config.VolRegion,
    endpoint: config.VolTosEndpoint,
});
