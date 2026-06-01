import type { FeedbackAddReq } from "@lib/common/dto/feedback";
import { currentTime } from "@lib/common/utils/time";
import { feedbackDao } from "@lib/repo/dao/feedback.dao";
import type { UserAuthInfo } from "@lib/repo/redis/user";

class FeedbackService {
    async addFeedback(user: UserAuthInfo, req: FeedbackAddReq) {
        const nowTime = currentTime();
        const feedbackInfo = {
            userId: user.id,
            email: req.email,
            feedbackType: req.feedbackType,
            feedbackBusinessId: req.feedbackBusinessId,
            description: req.description,
            createTime: nowTime,
            updateTime: nowTime,
        }
        await feedbackDao.addFeedback(feedbackInfo);
    }
}

export const feedbackService = new FeedbackService();
