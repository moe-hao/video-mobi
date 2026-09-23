import { Hono } from "hono";
import { collectionService } from "../services/collection/collection.service";
import { collectionCoverService } from "../services/collection/collection-cover.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { CollectionAddReqSchema, CollectionDeleteReqSchema, CollectionEditReqSchema, CollectionPublishReqSchema, CollectionTableListReqSchema } from "@lib/common/dto/collection.schema";

const collection = new Hono();

collection.get('/list', validated('query', CollectionTableListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await collectionService.getCollectionList(req);
    return c.json(success(resp));
});

collection.post('/add', validated('json', CollectionAddReqSchema), async (c) => {
    const req = c.req.valid('json')
    await collectionService.addCollection(req);
    return c.json(success());
});

collection.post('/edit', validated('json', CollectionEditReqSchema), async (c) => {
    const req = c.req.valid('json')
    await collectionService.editCollection(req);
    return c.json(success());
});

collection.post('/upload_cover', async (c) => {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const resp = await collectionCoverService.uploadCollectionCover(file);
    return c.json(success(resp));
});

collection.post('/delete', validated('json', CollectionDeleteReqSchema), async (c) => {
    const req = c.req.valid('json')
    await collectionService.deleteCollection(req.id);
    return c.json(success());
});

collection.post('/update_publish_status', validated('json', CollectionPublishReqSchema), async (c) => {
    const req = c.req.valid('json')
    await collectionService.updatePublishStatus(req);
    return c.json(success());
});

export default collection;
