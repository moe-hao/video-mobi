import { connectDatabase } from "../database";
import { logger } from "../logger";

export async function bootstrap() {
    logger.info('Application bootstrap...');
    await connectDatabase();
}
