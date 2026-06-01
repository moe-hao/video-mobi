import { VodService } from "@volcengine/openapi/lib/services/vod";
import config from "../config";

export const vod = new VodService({
    accessKeyId: config.VolAccessKeyId,
    secretKey: config.VolSecretKey,
    serviceName: config.VolServiceName,
    region: config.VolRegion,
});
