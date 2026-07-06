import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { bootstrap } from '@lib/internal/bootstrap';
import { errorHandler } from '@lib/middleware/error-handler';
import config from '@lib/internal/config';
import { logger } from '@lib/internal/logger';
import router from './router';
import { requestLogger } from '@lib/middleware/request-logger';

await bootstrap();
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
