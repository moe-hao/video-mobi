import { SkuPeriodType, SkuType } from "@lib/common/consts/sku";
import { currentTime } from "@lib/common/utils/time";
import { memberDao } from "@lib/repo/dao/member.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import type { OrderSelect } from "@lib/repo/models/order";
import { addMonths, addWeeks, addYears } from "date-fns";

class MemberDelivery {
    async deliver(orderInfo: OrderSelect) {
        const [memberInfo, skuInfo] = await Promise.all([
            memberDao.getMemberByUserId(orderInfo.userId),
            skuDao.getSkuById(orderInfo.skuId),
        ]);

        const nowTime = currentTime();
        if (skuInfo.skuType === SkuType.Subscription) {
            const periodType = skuInfo.periodType as SkuPeriodType;
            const shouldAddExpireTime = this.getShouldAddExpireTime(periodType, nowTime);

            if (!memberInfo) {
                await memberDao.addMember({
                    userId: orderInfo.userId,
                    expireTime: nowTime + shouldAddExpireTime,
                });
            } else {
                await memberDao.updateMemberById(memberInfo.id, {
                    expireTime: this.getMemberExpireTime(memberInfo.expireTime, shouldAddExpireTime),
                });
            }
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
            return currentTime() + shouldAddExpireTime;
        }
        return currentExpireTime + shouldAddExpireTime;
    }
}

export const memberDelivery = new MemberDelivery();
