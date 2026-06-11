import type { UserAuthInfo } from "@lib/repo/redis/user";
import { Hono } from "hono";
import { historyService } from "../services/history.service";
import { success } from "@lib/common/dto/result";
import { validated } from "@lib/middleware/validated";
import { collectionHistorySchema, historyDeleteReqSchema, userHistoryListReqSchema } from "@lib/common/dto/history";

const history = new Hono();

history.get("/user_history_list", validated('query', userHistoryListReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');
    const resp = await historyService.getHistoryListByUserId(user, req);
    return c.json(success(resp));
});

history.get("/collection_history", validated('query', collectionHistorySchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');
    const resp = await historyService.getCollectionHistory(user, req);
    return c.json(success(resp));
})

history.post("/delete", validated('json', historyDeleteReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('json');
    await historyService.deleteHistory(user, req);
    return c.json(success());
})

export default history;
