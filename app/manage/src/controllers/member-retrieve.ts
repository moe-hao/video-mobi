import { Hono } from "hono";
import { retrieveOptionService } from "../services/retrieve-option.service";
import { success } from "@lib/common/dto/result";
import { validated } from "@lib/middleware/validated";
import { RetrieveOptionAddReqSchema, RetrieveOptionDeleteReqSchema, RetrieveOptionEditReqSchema, RetrieveOptionListReqSchema } from "@lib/common/dto/retrieve-option.schema";

const memberRetrieve = new Hono();

memberRetrieve.get('/list', validated('query', RetrieveOptionListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const list = await retrieveOptionService.getRetrieveOptionList(req);
    return c.json(success(list));
});

memberRetrieve.post('/add', validated('json', RetrieveOptionAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await retrieveOptionService.addRetrieveOption(req);
    return c.json(success());
});

memberRetrieve.post('/edit', validated('json', RetrieveOptionEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await retrieveOptionService.editRetrieveOption(req);
    return c.json(success());
});

memberRetrieve.post('/delete', validated('json', RetrieveOptionDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await retrieveOptionService.deleteRetrieveOption(req.id);
    return c.json(success());
});

export default memberRetrieve;
