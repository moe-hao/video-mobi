import { Hono } from "hono";
import { collectionFeatureService } from "../services/collection/collection-feature.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { collectionFeatureAddReqSchema, collectionFeatureDeleteReqSchema, collectionFeatureEditReqSchema, collectionFeatureListReqSchema } from "@lib/common/dto/collection";

const collectionFeature = new Hono();

collectionFeature.get('/list', validated('query', collectionFeatureListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await collectionFeatureService.getCollectionFeatureList(req);
    return c.json(success(resp));
});

collectionFeature.post('/add', validated('json', collectionFeatureAddReqSchema), async (c) => {
    const req = c.req.valid('json');
    await collectionFeatureService.addCollectionFeature(req);
    return c.json(success());
});

collectionFeature.post('/edit', validated('json', collectionFeatureEditReqSchema), async (c) => {
    const req = c.req.valid('json');
    await collectionFeatureService.editCollectionFeature(req);
    return c.json(success());
});

collectionFeature.post('/delete', validated('json', collectionFeatureDeleteReqSchema), async (c) => {
    const req = c.req.valid('json');
    await collectionFeatureService.deleteCollectionFeature(req);
    return c.json(success());
});

export default collectionFeature;
