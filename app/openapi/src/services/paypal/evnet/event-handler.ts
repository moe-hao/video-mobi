import { SubscriptionEventHandler } from "./subscription-event-handler";
import { SaleEventHandler } from "./sale-event-handler";
import { logger } from "@lib/internal/logger";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import type { PaypalEventReq } from "@lib/common/dto/paypal";
import { PaypalResourceType } from "@lib/common/consts/paypal";
import { ResultCode } from "@lib/common/consts/result";


export interface EventHandler {
    handle(req: PaypalEventReq): Promise<void>;
}

export class EventHandlerFactory {
    static createEventHandler(resourceType: PaypalResourceType): EventHandler {
        logger.info(`createEventHandler: ${resourceType}`);
        switch (resourceType) {
            case PaypalResourceType.Subscription:
                return new SubscriptionEventHandler();
            case PaypalResourceType.Sale:
                return new SaleEventHandler();
            default:
                throw new InternalException(ResultCode.MethodNotSupported)
        }
    }
}
