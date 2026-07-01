import { memberDao } from "@lib/repo/dao/member.dao";
import type { MemberInfoResp } from "@lib/common/dto/member";
import type { UserAuthInfo } from "@lib/repo/redis/user";

export async function getMemberInfo(user: UserAuthInfo): Promise<MemberInfoResp> {
    const memberInfo = await memberDao.getMemberByUserId(user.id);
    if (memberInfo) {
        return {
            expireTime: memberInfo.expireTime,
            coinNum: memberInfo.coinNum,
        }
    }
    return {
        expireTime: 0,
        coinNum: 0,
    }
}
