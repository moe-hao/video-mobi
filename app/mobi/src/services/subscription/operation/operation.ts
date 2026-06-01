import { PaymentChannel } from "@lib/common/consts/payment";
import type { SubscriptionSelect } from "@lib/repo/models/subscription";
import { PayermaxOperation } from "./payermax-operation";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";

export interface Operation {
    cancel: (subscriptionInfo: SubscriptionSelect) => Promise<void>;
}

export class SubscriptionOperationFactory {
    static createOperation(channel: PaymentChannel): Operation {
        switch (channel) {
            case PaymentChannel.Payermax:
                return new PayermaxOperation();
            default:
                throw new InternalException(ResultCode.ChannelNotSupported);
        }
    }
}
