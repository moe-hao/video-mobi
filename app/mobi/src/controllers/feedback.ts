import { Hono } from "hono";
import { feedbackService } from "../services/feedback.service";
import { feedbackAddReq } from "@lib/common/dto/feedback";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";

const feedback = new Hono();

feedback.post('/add', validated("json", feedbackAddReq), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const data = c.req.valid('json');
    await feedbackService.addFeedback(user, data);
    return c.json(success());
});

export default feedback;
