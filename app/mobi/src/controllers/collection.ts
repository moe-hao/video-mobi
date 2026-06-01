import { Hono } from "hono";
import { getCollectionPage, getFeaturedCollections } from "../services/collection.service";
import { validated } from "@lib/middleware/validated";
import { collectionListReqSchema } from "@lib/common/dto/collection";
import { success } from "@lib/common/dto/result";

const collection = new Hono();

collection.get('/list', validated('query', collectionListReqSchema), async (c) => {
    const { page, size } = c.req.valid('query');
    const resp = await getCollectionPage(page, size);
    return c.json(success(resp));
});

collection.get('/feature', async (c) => {
    const resp = await getFeaturedCollections();
    return c.json(success(resp));
});

export default collection;
