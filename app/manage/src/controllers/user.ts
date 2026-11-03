import { Hono } from "hono";
import { userService } from "../services/user.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { UserListReqSchema, ManageUserDetailReqSchema, ManageUserHistoryReqSchema } from "@lib/common/dto/user.schema";


const user = new Hono();

user.get('/list', validated('query', UserListReqSchema), async (c) => {
    const req = c.req.valid('query')
    const resp = await userService.getUserList(req);
    return c.json(success(resp));
})

user.get('/detail', validated('query', ManageUserDetailReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await userService.getUserDetail(req);
    return c.json(success(resp));
})

user.get('/watch_history', validated('query', ManageUserHistoryReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await userService.getUserWatchHistory(req);
    return c.json(success(resp));
})

user.get('/coin_history', validated('query', ManageUserHistoryReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await userService.getUserCoinHistory(req);
    return c.json(success(resp));
})

export default user;
