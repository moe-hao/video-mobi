import { Hono } from "hono";
import { getMemberInfo } from "../services/member.service";
import { success } from "@lib/common/dto/result";
import type { UserAuthInfo } from "@lib/repo/redis/user";

const member = new Hono();

member.get('/info', async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const result = await getMemberInfo(user);
    return c.json(success(result));
});

export default member;
