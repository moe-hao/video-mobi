import type { UserListReq, UserListResp } from "@lib/common/dto/user";
import { formatUnixTime } from "@lib/common/utils/time";
import { memberDao } from "@lib/repo/dao/member.dao";
import { productDao } from "@lib/repo/dao/product.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import type { MemberSelect } from "@lib/repo/models/member";
import type { ProductSelect } from "@lib/repo/models/product";

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

        const productIds = userInfoList.map((item) => item.productId);
        const productInfoList = await productDao.getProductListInIds(productIds);

        const productIdToProductInfoMap: Map<number, ProductSelect> = productInfoList.reduce((prev, cur) => {
            prev.set(cur.id, cur);
            return prev;
        }, new Map<number, ProductSelect>());

        return {
            page: req.page,
            size: req.size,
            total: userInfoListTotal,
            list: userInfoList.map((item) => ({
                id: item.id,
                bizId: item.bizId,
                username: item.username,
                email: item.email,
                memberStatus: (() => { const m = userIdToMemberMap.get(item.id); return m && m.expireTime > Math.floor(Date.now() / 1000) ? '订阅中' : '未订阅'; })(),
                expireTime: (() => { const t = userIdToMemberMap.get(item.id)?.expireTime ?? 0; return t === 0 ? '-' : formatUnixTime(t); })(),
                coinNum: userIdToMemberMap.get(item.id)?.coinNum ?? 0,
                productHost: productIdToProductInfoMap.get(item.productId)?.host || '',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }
}

export const userService = new UserService();
