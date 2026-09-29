import { logger } from "./logger.ts";
import { config } from "./config.ts";
import { database } from "./database.ts";

export default async function bootstrap() {
    logger.info("Bootscript app running: Success!");
    logger.info("Config Loaded - env: %s", config.AppEnv);
    await database.execute('SELECT 1');
}
