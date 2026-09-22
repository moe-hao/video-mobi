import '@lib/internal/base/boot';
import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { errorHandler } from '@lib/middleware/error-handler';
import { config } from '@lib/internal/base/config';
import { logger } from '@lib/internal/base/logger';
import router from './router';
import { requestLogger } from '@lib/middleware/request-logger';

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
})
