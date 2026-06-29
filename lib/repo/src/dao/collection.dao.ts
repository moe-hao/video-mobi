
import { and, count, desc, eq, inArray, like, or } from "drizzle-orm";
import { collectionTable, type CollectionInsert, type CollectionSelect } from "../models/collection";
import { database, type DatabaseConn } from "@lib/internal/database";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { currentTime } from "@lib/common/utils/time";
import type { Language } from "@lib/common/consts/region";
import { CollectionType, PublishStatus } from "@lib/common/consts/collection";


export type SearchCollection = {
    search: string;
    language: Language | string;
    collectionType: CollectionType | string;
    publishStatus: PublishStatus | string;
}

class CollectionDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getCollectionListSearch(page: number, size: number, search: SearchCollection): Promise<CollectionSelect[]> {
        const conditions = [];
        if (search.search) {
            const searchConditions = [];
            if (!isNaN(Number(search.search))) {
                searchConditions.push(eq(collectionTable.id, Number(search.search)));
            }

            searchConditions.push(eq(collectionTable.bizId, search.search));
            searchConditions.push(like(collectionTable.name, `%${search.search}%`));
            searchConditions.push(like(collectionTable.sourceName, `%${search.search}%`));
            conditions.push(or(...searchConditions));
        }

        if (search.language !== '') {
            conditions.push(eq(collectionTable.language, search.language as Language));
        }

        if (search.collectionType !== '') {
            conditions.push(eq(collectionTable.collectionType, Number(search.collectionType) as CollectionType));
        }

        if (search.publishStatus !== '') {
            conditions.push(eq(collectionTable.publishStatus, Number(search.publishStatus) as PublishStatus));
        }

        conditions.push(eq(collectionTable.isDeleted, DeleteStatus.NotDeleted));
        return await this.conn.select().from(collectionTable).where(and(...conditions)).orderBy(desc(collectionTable.id)).offset((page - 1) * size).limit(size);
    }

    async getCollectionTotalSearch(search: SearchCollection): Promise<number> {
        const conditions = [];
        if (search.search) {
            const searchConditions = [];
            if (!isNaN(Number(search.search))) {
                searchConditions.push(eq(collectionTable.id, Number(search.search)));
            }

            searchConditions.push(eq(collectionTable.bizId, search.search));
            searchConditions.push(like(collectionTable.name, `%${search.search}%`));
            searchConditions.push(like(collectionTable.sourceName, `%${search.search}%`));
            conditions.push(or(...searchConditions));
        }

        if (search.language !== '') {
            conditions.push(eq(collectionTable.language, search.language as Language));
        }

        if (search.collectionType !== '') {
            conditions.push(eq(collectionTable.collectionType, Number(search.collectionType) as CollectionType));
        }

        if (search.publishStatus !== '') {
            conditions.push(eq(collectionTable.publishStatus, Number(search.publishStatus) as PublishStatus));
        }

        conditions.push(eq(collectionTable.isDeleted, DeleteStatus.NotDeleted));
        const result = await this.conn.select({ count: count() }).from(collectionTable).where(and(...conditions));
        return result[0].count;
    }

    async getCollectionListBySearch(search: string): Promise<CollectionSelect[]> {
        const conditions = [];
        if (search) {
            const searchConditions = [];
            if (!isNaN(Number(search))) {
                searchConditions.push(eq(collectionTable.id, Number(search)));
            }

            searchConditions.push(eq(collectionTable.bizId, search));
            searchConditions.push(like(collectionTable.name, `%${search}%`));
            searchConditions.push(like(collectionTable.sourceName, `%${search}%`));
            conditions.push(or(...searchConditions));
        }

        conditions.push(eq(collectionTable.isDeleted, DeleteStatus.NotDeleted));
        return await this.conn.select().from(collectionTable).where(and(...conditions));
    }

    async getCollectionPage(page: number, size: number, language: Language, collectionTypeList: CollectionType[]): Promise<CollectionSelect[]> {
        const collections = await this.conn.select().from(collectionTable)
            .where(
                and(
                    eq(collectionTable.language, language),
                    inArray(collectionTable.collectionType, collectionTypeList),
                    eq(collectionTable.isDeleted, DeleteStatus.NotDeleted),
                    eq(collectionTable.publishStatus, PublishStatus.Published)
                )
            )
            .orderBy(desc(collectionTable.id))
            .offset((page - 1) * size)
            .limit(size);
        return collections;
    }

    async getCollectionTotal(language: Language, collectionTypeList: CollectionType[]): Promise<number> {
        const result = await this.conn.select({ count: count() }).from(collectionTable).where(
            and(
                eq(collectionTable.language, language),
                inArray(collectionTable.collectionType, collectionTypeList),
                eq(collectionTable.isDeleted, DeleteStatus.NotDeleted)
            )
        );
        return result?.[0]?.count || 0;
    }

    async getCollectionById(id: number): Promise<CollectionSelect> {
        const [result] = await this.conn.select().from(collectionTable).where(eq(collectionTable.id, id));
        return result;
    }

    async getCollectionInIds(ids: number[]): Promise<CollectionSelect[]> {
        const collections = await this.conn.select().from(collectionTable).where(
            inArray(collectionTable.id, ids)
        )
        return collections;
    }

    async getCollectionByBizId(bizId: string): Promise<CollectionSelect> {
        const [collection] = await this.conn.select().from(collectionTable).where(
            eq(collectionTable.bizId, bizId)
        );
        return collection;
    }

    async getCollectionInBizIds(bizIds: string[]): Promise<CollectionSelect[]> {
        const collections = await this.conn.select().from(collectionTable).where(
            inArray(collectionTable.bizId, bizIds)
        )
        return collections;
    }

    async addCollection(data: CollectionInsert) {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(collectionTable).values(data);
    }

    async updateCollectionById(id: number, data: CollectionInsert) {
        data.updateTime = currentTime();
        await this.conn.update(collectionTable).set(data).where(eq(collectionTable.id, id));
    }
}

export const collectionDao = new CollectionDao();
