import { serve } from '@hono/node-server'
import { errorHandler } from '@lib/middleware/error-handler';
import { config } from '@lib/internal/base/config';
import { logger } from '@lib/internal/base/logger';
import router from './router.ts';
import { requestLogger } from '@lib/middleware/request-logger';
import { Hono } from 'hono';
import bootstrap from '@lib/internal/base/boot';

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
    logger.info(`Server running success:${info.port}`);
})
