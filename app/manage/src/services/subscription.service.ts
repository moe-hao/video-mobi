import { SubscriptionStatus, SubscriptionStatusName } from "@lib/common/consts/subscription";
import type { SubscriptionListReq, SubscriptionListResp } from "@lib/common/dto/subscription";
import { formatUnixTime } from "@lib/common/utils/time";
import { subscriptionDao } from "@lib/repo/dao/subscription.dao";
import { userDao } from "@lib/repo/dao/user.dao";

class SubscriptionService {
    async getSubscriptionList(req: SubscriptionListReq): Promise<SubscriptionListResp> {
        const search = {
            status: req.status,
            subscriptionNo: req.subscriptionNo ?? '',
            startDate: req.startDate ?? '',
            endDate: req.endDate ?? '',
        }
        const [subscriptionList, subscriptionTotal] = await Promise.all([
            subscriptionDao.getSubscriptionPageList(req.page, req.size, search),
            subscriptionDao.getSubscriptionPageTotal(search),
        ]);

        const userIds = subscriptionList.map((item) => item.userId);
        const userInfoList = await userDao.getUserListByIds(userIds);
        const userIdToInfo = new Map(userInfoList.map((item) => [item.id, item]));

        return {
            page: req.page,
            size: req.size,
            total: subscriptionTotal,
            list: subscriptionList.map((item) => ({
                id: item.id,
                userId: item.userId,
                username: userIdToInfo.get(item.userId)?.username,
                subscriptionNo: item.subscriptionNo,
                subscriptionStatus: item.subscriptionStatus,
                subscriptionStatusName: SubscriptionStatusName[item.subscriptionStatus as SubscriptionStatus],
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    }
}

export const subscriptionService = new SubscriptionService();
