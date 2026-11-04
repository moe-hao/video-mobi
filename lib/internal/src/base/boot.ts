import { logger } from "./logger";
import { config } from "./config";
import { database } from "./database";

export default async function bootstrap() {
    logger.info("Bootscript app running: Success!");
    logger.info("Config Loaded - env: %s", config.AppEnv);
    await database.execute('SELECT 1');
}
