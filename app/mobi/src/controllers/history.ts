import type { UserAuthInfo } from "@lib/repo/redis/user";
import { Hono } from "hono";
import { historyService } from "../services/history.service";
import { success } from "@lib/common/dto/result";
import { validated } from "@lib/middleware/validated";
import { CollectionHistoryReqSchema, HistoryDeleteReqSchema, UserHistoryListReqSchema } from "@lib/common/dto/history.schema";

const history = new Hono();

history.get("/user_history_list", validated('query', UserHistoryListReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');
    const resp = await historyService.getHistoryListByUserId(user, req);
    return c.json(success(resp));
});

history.get("/collection_history", validated('query', CollectionHistoryReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('query');
    const resp = await historyService.getCollectionHistory(user, req);
    return c.json(success(resp));
})

history.post("/delete", validated('json', HistoryDeleteReqSchema), async (c) => {
    const user = await c.get('user' as never) as UserAuthInfo;
    const req = c.req.valid('json');
    await historyService.deleteHistory(user, req);
    return c.json(success());
})

export default history;
