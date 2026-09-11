import config from '../config';
import openapi from '@volcengine/openapi';

export const vod = new openapi.vodOpenapi.VodService({
    accessKeyId: config.VolAccessKeyId,
    secretKey: config.VolSecretKey,
    serviceName: config.VolServiceName,
    region: config.VolRegion,
});
