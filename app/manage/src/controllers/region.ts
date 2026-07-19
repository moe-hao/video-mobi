import { Hono } from "hono";
import { success } from "@lib/common/dto/result";
import { regionService } from "../services/region.service";
import { regionListReqSchema, regionAddReqSchema, regionEditReqSchema, regionDeleteReqSchema } from "@lib/common/dto/region";
import { validated } from "@lib/middleware/validated";

const region = new Hono();

region.get('/list', validated('query', regionListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await regionService.getRegionList(req);
    return c.json(success(resp));
});

region.post('/add', validated('json', regionAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await regionService.addRegion(req);
    return c.json(success());
});

region.post('/edit', validated('json', regionEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await regionService.updateRegion(req);
    return c.json(success());
});

region.post('/delete', validated('json', regionDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await regionService.deleteRegion(req);
    return c.json(success());
});

export default region;
