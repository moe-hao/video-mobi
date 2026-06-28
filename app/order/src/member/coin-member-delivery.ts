import type { OrderSelect } from "@lib/repo/models/order";
import type { MemberDelivery } from "./member-delivery";
import { memberDao } from "@lib/repo/dao/member.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";

export class CoinMemberDelivery implements MemberDelivery {
    constructor(private readonly orderInfo: OrderSelect) { }

    async deliver() {
        const [memberInfo, skuInfo] = await Promise.all([
            memberDao.getMemberByUserId(this.orderInfo.userId),
            skuDao.getSkuById(this.orderInfo.skuId),
        ]);

        if (!memberInfo) {
            await memberDao.addMember({
                userId: this.orderInfo.userId,
                coinNum: skuInfo.coinNum,
            });
        } else {
            await memberDao.updateMemberById(memberInfo.id, {
                coinNum: memberInfo.coinNum + skuInfo.coinNum,
            });
        }
    }
}
