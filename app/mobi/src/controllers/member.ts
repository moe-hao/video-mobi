import { Hono } from "hono";
import { memberService } from "../services/member.service";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";
import { validated } from "@lib/middleware/validated";
import { userCoinHistoryReqSchema } from "@lib/common/dto/user";

const member = new Hono();

member.get('/info', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const result = await memberService.getMemberInfo(user);
    return c.json(success(result));
});

member.get('/coin_history', validated('query', userCoinHistoryReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');
    const result = await memberService.getMemberCoinHistory(user, req);
    return c.json(success(result));
});

export default member;
