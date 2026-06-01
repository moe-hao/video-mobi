
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { collectionFeatureTable, type CollectionFeatureInsert, type CollectionFeatureSelect } from "../models/collection-feature";
import { database, type DatabaseConn } from "@lib/internal/database";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { CollectionFeatureSortStatus } from "@lib/common/consts/collection-feature";
import { currentTime } from "@lib/common/utils/time";

type SearchPageParam = {
    page: number,
    size: number,
    weightSort?: CollectionFeatureSortStatus,
}

class CollectionFeatureDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getCollectionFeatureListPage(search: SearchPageParam, collectionIds: number[]): Promise<CollectionFeatureSelect[]> {
        const conditions = [];
        if (collectionIds.length > 0) {
            conditions.push(inArray(collectionFeatureTable.collectionId, collectionIds));
        }
        conditions.push(eq(collectionFeatureTable.isDeleted, DeleteStatus.NotDeleted));

        if (search.weightSort === CollectionFeatureSortStatus.Asc) {
            return await this.conn.select().from(collectionFeatureTable).where(and(...conditions)).orderBy(asc(collectionFeatureTable.weight)).offset((search.page - 1) * search.size).limit(search.size);
        }

        if (search.weightSort === CollectionFeatureSortStatus.Desc) {
            return await this.conn.select().from(collectionFeatureTable).where(and(...conditions)).orderBy(desc(collectionFeatureTable.weight)).offset((search.page - 1) * search.size).limit(search.size);
        }

        return await this.conn.select().from(collectionFeatureTable).where(and(...conditions)).orderBy(desc(collectionFeatureTable.id)).offset((search.page - 1) * search.size).limit(search.size);
    }

    async getCollectionFeaturePageTotal(collectionIds: number[]): Promise<number> {
        const conditions = [];
        if (collectionIds.length > 0) {
            conditions.push(inArray(collectionFeatureTable.collectionId, collectionIds));
        }
        conditions.push(eq(collectionFeatureTable.isDeleted, DeleteStatus.NotDeleted));

        const [result] = await this.conn.select({ count: count() }).from(collectionFeatureTable).where(and(...conditions));
        return result.count;
    }

    async getFeaturedCollections() {
        return await this.conn.select().from(collectionFeatureTable).where(
            eq(collectionFeatureTable.isDeleted, DeleteStatus.NotDeleted)
        ).orderBy(desc(collectionFeatureTable.weight));
    }

    async getCollectionFeatureByCollectionId(collectionId: number): Promise<CollectionFeatureSelect[]> {
        return await this.conn.select().from(collectionFeatureTable).where(
            and(
                eq(collectionFeatureTable.collectionId, collectionId),
                eq(collectionFeatureTable.isDeleted, DeleteStatus.NotDeleted)
            ),
        );
    }

    async addCollectionFeature(data: CollectionFeatureInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(collectionFeatureTable).values(data);
    }

    async updateCollectionFeatureById(id: number, data: CollectionFeatureInsert): Promise<void> {
        await this.conn.update(collectionFeatureTable).set(data).where(eq(collectionFeatureTable.id, id));
    }
}

export const collectionFeatureDao = new CollectionFeatureDao();
