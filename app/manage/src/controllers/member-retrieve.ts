import { Hono } from "hono";
import { retrieveOptionService } from "../services/retrieve-option.service";
import { success } from "@lib/common/dto/result";
import { validated } from "@lib/middleware/validated";
import { retrieveOptionAddReqSchema, retrieveOptionDeleteReqSchema, retrieveOptionEditReqSchema, retrieveOptionListReqSchema } from "@lib/common/dto/retrieve-option";

const memberRetrieve = new Hono();

memberRetrieve.get('/list', validated('query', retrieveOptionListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const list = await retrieveOptionService.getRetrieveOptionList(req);
    return c.json(success(list));
});

memberRetrieve.post('/add', validated('json', retrieveOptionAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await retrieveOptionService.addRetrieveOption(req);
    return c.json(success());
});

memberRetrieve.post('/edit', validated('json', retrieveOptionEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await retrieveOptionService.editRetrieveOption(req);
    return c.json(success());
});

memberRetrieve.post('/delete', validated('json', retrieveOptionDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await retrieveOptionService.deleteRetrieveOption(req.id);
    return c.json(success());
});

export default memberRetrieve;
