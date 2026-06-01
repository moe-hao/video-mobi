import { Hono } from "hono";
import { userService } from "../services/user.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { userListReqSchema } from "@lib/common/dto/user";


const user = new Hono();

user.get('/list', validated('query', userListReqSchema), async (c) => {
    const req = c.req.valid('query')
    const resp = await userService.getUserList(req);
    return c.json(success(resp));
})

export default user;
