import type { OrderSelect } from "@lib/repo/models/order";
import type { MemberDelivery } from "./member-delivery";
import { memberDao } from "@lib/repo/dao/member.dao";
import { skuDao } from "@lib/repo/dao/sku.dao";
import { userCoinHistoryDao } from "@lib/repo/dao/user-coin-history.dao";
import { UnlockCommType } from "@lib/common/consts/unlock-coin";

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
                coinNum: skuInfo.coinNum + skuInfo.coinBonus,
            });
        } else {
            await memberDao.updateMemberById(memberInfo.id, {
                coinNum: memberInfo.coinNum + skuInfo.coinNum + skuInfo.coinBonus,
            });
        }

        await userCoinHistoryDao.addUserCoinHistory({
            userId: this.orderInfo.userId,
            collectionId: 0,
            coinNum: skuInfo.coinNum + skuInfo.coinBonus,
            commType: UnlockCommType.Charge
        });
    }
}
