import type { OrderSelect } from "@lib/repo/models/order";
import type { MemberDelivery } from "./member-delivery";
import { memberDao } from "@lib/repo/dao/member.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { currentTime } from "@lib/common/utils/time";
import { SkuPeriodType } from "@lib/common/consts/sku";
import { addMonths, addWeeks, addYears } from "date-fns";

export class SubscriptionMemberDelivery implements MemberDelivery {
    constructor(private readonly orderInfo: OrderSelect) { }

    async deliver() {
        const [memberInfo, skuInfo] = await Promise.all([
            memberDao.getMemberByUserId(this.orderInfo.userId),
            skuDao.getSkuById(this.orderInfo.skuId),
        ]);

        const nowTime = currentTime();
        const periodType = skuInfo.periodType as SkuPeriodType;
        const shouldAddExpireTime = this.getShouldAddExpireTime(periodType, nowTime);

        if (!memberInfo) {
            await memberDao.addMember({
                userId: this.orderInfo.userId,
                expireTime: nowTime + shouldAddExpireTime + 86400,
            });
        } else {
            await memberDao.updateMemberById(memberInfo.id, {
                expireTime: this.getMemberExpireTime(memberInfo.expireTime, shouldAddExpireTime),
            });
        }

    }



    private getShouldAddExpireTime(periodType: SkuPeriodType, nowTime: number): number {
        switch (periodType) {
            case SkuPeriodType.Week:
                return (addWeeks(nowTime, 1).getTime() - nowTime) / 1000;
            case SkuPeriodType.Month:
                return (addMonths(nowTime, 1).getTime() - nowTime) / 1000;
            case SkuPeriodType.Year:
                return (addYears(nowTime, 1).getTime() - nowTime) / 1000;
            default:
                return 0;
        }
    }

    private getMemberExpireTime(currentExpireTime: number, shouldAddExpireTime: number): number {
        if (currentExpireTime <= shouldAddExpireTime) {
            return currentTime() + shouldAddExpireTime + 86400;
        }
        return currentExpireTime + shouldAddExpireTime;
    }
}
