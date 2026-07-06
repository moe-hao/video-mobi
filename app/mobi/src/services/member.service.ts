import { memberDao } from "@lib/repo/dao/member.dao";
import type { MemberInfoResp } from "@lib/common/dto/member";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { userCoinHistoryDao } from "@lib/repo/dao/user-coin-history.dao";
import type { UserCoinHistoryReq, UserCoinHistoryResp } from "@lib/common/dto/user";
import type { UnlockCommType } from "@lib/common/consts/unlock-coin";
import { formatUnixTime } from "@lib/common/utils/time";

export const memberService = {
    getMemberInfo: async (user: UserAuthInfo): Promise<MemberInfoResp> => {
        const memberInfo = await memberDao.getMemberByUserId(user.id);
        if (memberInfo) {
            return {
                expireTime: memberInfo.expireTime,
                coinNum: memberInfo.coinNum,
            };
        }

        return {
            expireTime: 0,
            coinNum: 0,
        };
    },

    getMemberCoinHistory: async (user: UserAuthInfo, req: UserCoinHistoryReq): Promise<UserCoinHistoryResp> => {
        const [unlockList, unlockTotal] = await Promise.all([
            userCoinHistoryDao.getCoinHistoryListByUserId(req.page, req.size, user.id),
            userCoinHistoryDao.getCoinHistoryTotalByUserId(user.id),
        ]);

        return {
            page: req.page,
            size: req.size,
            total: unlockTotal,
            list: unlockList.map(item => ({
                coinNum: item.coinNum,
                commType: item.commType as UnlockCommType,
                createTime: formatUnixTime(item.createTime),
            })),
        }
    }
}
