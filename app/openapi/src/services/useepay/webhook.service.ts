import type { UseePayWebhookEvent } from "@lib/common/dto/useepay/useepay-event";
import { createEventHandler } from "./event/event-handler";
import { logger } from "@lib/internal/logger";

export async function handleWebhookEvent(req: UseePayWebhookEvent) {
    try {
        await createEventHandler(req.name).handle(req);
    } catch (error) {
        logger.error(error);
    }
}
