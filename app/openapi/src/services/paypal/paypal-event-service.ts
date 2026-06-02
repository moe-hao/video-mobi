import type { PaypalEventReq } from "@lib/common/dto/paypal";
import { EventHandlerFactory } from "./evnet/event-handler";

class PaypalEventService {
    async handleEvent(req: PaypalEventReq): Promise<void> {
        await EventHandlerFactory.createEventHandler(req.resource_type).handle(req);
    }
}

export const paypalEventService = new PaypalEventService();
