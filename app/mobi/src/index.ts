import '@lib/internal/base/boot';
import { logger } from '@lib/internal/base/logger';
import { Hono } from 'hono';
import router from './router';
import { config } from '@lib/internal/base/config';
import { serve } from '@hono/node-server';
import { errorHandler } from '@lib/middleware/error-handler.js';
import { requestLogger } from '@lib/middleware/request-logger.js';

const app = new Hono()
app.onError(errorHandler);
app.use(requestLogger);

app.route('/api', router);

const server = {
    fetch: app.fetch,
    port: config.AppServerPort,
}

serve(server, (info) => {
    logger.info(`Server is running success :${info.port}`);
});
