import type { ManageUserCoinHistoryResp, ManageUserDetailResp, ManageUserDetailReq, ManageUserHistoryReq, ManageUserWatchHistoryResp, UserListReq, UserListResp } from "@lib/common/dto/user";
import { formatUnixTime } from "@lib/common/utils/time";
import { memberDao } from "@lib/repo/dao/member.dao";
import { productDao } from "@lib/repo/dao/product.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import type { MemberSelect } from "@lib/repo/models/member";
import type { ProductSelect } from "@lib/repo/models/product";
import { userCoinHistoryDao } from "@lib/repo/dao/user-coin-history.dao";
import { historyDao } from "@lib/repo/dao/history.dao";
import { collectionDao } from "@lib/repo/dao/collection.dao";
import type { UnlockCommType } from "@lib/common/consts/unlock-coin";

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
                memberStatus: (() => { const m = userIdToMemberMap.get(item.id); return m && m.expireTime > Math.floor(Date.now() / 1000) ? 'Active' : 'Inactive'; })(),
                expireTime: (() => { const t = userIdToMemberMap.get(item.id)?.expireTime ?? 0; return t === 0 ? '-' : formatUnixTime(t); })(),
                coinNum: userIdToMemberMap.get(item.id)?.coinNum ?? 0,
                productHost: productIdToProductInfoMap.get(item.productId)?.host || '',
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            }))
        }
    }

    async getUserDetail(req: ManageUserDetailReq): Promise<ManageUserDetailResp> {
        const [userInfo, memberInfo] = await Promise.all([
            userDao.getUserInfoById(req.userId),
            memberDao.getMemberByUserId(req.userId),
        ]);

        return {
            id: userInfo.id,
            bizId: userInfo.bizId,
            username: userInfo.username,
            email: userInfo.email,
            memberStatus: memberInfo && memberInfo.expireTime > Math.floor(Date.now() / 1000) ? 'Active' : 'Inactive',
            expireTime: (() => { const t = memberInfo?.expireTime ?? 0; return t === 0 ? '-' : formatUnixTime(t); })(),
            coinNum: memberInfo?.coinNum ?? 0,
        };
    }

    async getUserWatchHistory(req: ManageUserHistoryReq): Promise<ManageUserWatchHistoryResp> {
        const [historyList, historyTotal] = await Promise.all([
            historyDao.getHistoryPageByUserId(req.userId, req.page, req.size),
            historyDao.getHistoryCountByUserId(req.userId),
        ]);

        const collectionIds = historyList.map(item => item.collectionId);
        const collectionList = collectionIds.length > 0 ? await collectionDao.getCollectionInIds(collectionIds) : [];
        const collectionIdToInfo = new Map(collectionList.map((item) => [item.id, item]));

        return {
            page: req.page,
            size: req.size,
            total: historyTotal,
            list: historyList.map(item => ({
                collectionName: collectionIdToInfo.get(item.collectionId)?.name || '--',
                epNum: item.epNum,
                collectionEpisodes: collectionIdToInfo.get(item.collectionId)?.episodes || 0,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    }

    async getUserCoinHistory(req: ManageUserHistoryReq): Promise<ManageUserCoinHistoryResp> {
        const [coinList, coinTotal] = await Promise.all([
            userCoinHistoryDao.getCoinHistoryListByUserId(req.page, req.size, req.userId),
            userCoinHistoryDao.getCoinHistoryTotalByUserId(req.userId),
        ]);

        const collectionIds = coinList.map(item => item.collectionId).filter(id => id > 0);
        const collectionList = collectionIds.length > 0 ? await collectionDao.getCollectionInIds(collectionIds) : [];
        const collectionIdToInfo = new Map(collectionList.map((item) => [item.id, item]));

        return {
            page: req.page,
            size: req.size,
            total: coinTotal,
            list: coinList.map(item => ({
                coinNum: item.coinNum,
                commType: item.commType as UnlockCommType,
                collectionName: item.collectionId > 0 ? (collectionIdToInfo.get(item.collectionId)?.name || '--') : '--',
                epNum: item.epNum,
                createTime: formatUnixTime(item.createTime),
            })),
        };
    }
}

export const userService = new UserService();
