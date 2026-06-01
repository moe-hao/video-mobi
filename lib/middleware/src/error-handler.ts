import { failed } from "@lib/common/dto/result";
import { logger } from "@lib/internal/logger";
import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = async (error, c) => {
    logger.error({ err: error });
    return c.json(failed(error));
}
