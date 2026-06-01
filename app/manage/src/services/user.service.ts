import type { UserListReq, UserListResp } from "@lib/common/dto/user";
import { formatUnixTime } from "@lib/common/utils/time";
import { memberDao } from "@lib/repo/dao/member.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import type { MemberSelect } from "@lib/repo/models/member";

class UserService {
    async getUserList(req: UserListReq): Promise<UserListResp> {
        const [userInfoList, userInfoListTotal] = await Promise.all([
            userDao.getUserListSearch(req.page, req.size, req.search),
            userDao.getUserTotalSearch(req.search),
        ]);

        const userIds = userInfoList.map((item) => item.id);
        const memberList = await memberDao.getMemberListByUserIds(userIds);
        const userIdToMemberMap: Map<number, MemberSelect> = memberList.reduce((prev, cur) => {
            prev.set(cur.userId, cur);
            return prev;
        }, new Map<number, MemberSelect>());

        return {
            page: req.page,
            size: req.size,
            total: userInfoListTotal,
            list: userInfoList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                username: item.username,
                email: item.email,
                memberStatus: userIdToMemberMap.get(item.id) ? '订阅中' : '未订阅',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }
}

export const userService = new UserService();
