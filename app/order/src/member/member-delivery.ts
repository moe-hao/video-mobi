import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import type { OrderSelect } from "@lib/repo/models/order";
import { SubscriptionMemberDelivery } from "./subscription-member-delivery";
import { CoinMemberDelivery } from "./coin-member-delivery";
import { SkuType } from "@lib/common/consts/sku";

export interface MemberDelivery {
    deliver(): Promise<void>;
}

export class MemberDeliveryFactory {
    static create(orderInfo: OrderSelect): MemberDelivery {
        switch (orderInfo.orderType) {
            case SkuType.Subscription:
                return new SubscriptionMemberDelivery(orderInfo);
            case SkuType.Coin:
                return new CoinMemberDelivery(orderInfo);
            default:
                throw new InternalException(ResultCode.MethodNotSupported.code, "Member delivery not supported");
        }
    }
}
