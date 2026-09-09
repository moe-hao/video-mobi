import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { createEventHandler } from "./event/event-handler";
import { logger } from "@lib/internal/logger";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";

export async function handleWebhookEvent(req: UseePayWebhookEvent) {
    try {
        await createEventHandler(req.name).handle(req);
    } catch (error) {
        if (error instanceof InternalException && error.code === ResultCode.MethodNotSupported.code) {
            logger.info(`Method ${req.name} is not supported`);
        } else {
            logger.error(error);
        }
    }
}
