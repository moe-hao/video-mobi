import { database, type DatabaseConn } from "@lib/internal/database";
import { skuTable, type SkuInsert, type SkuSelect } from "../models/sku";
import { and, count, desc, eq, or } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";
import { DeleteStatus } from "@lib/common/consts/common-status";

type SkuManageSearch = {
    search: string;
    productId: number;
}

class SkuDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getSkuPageList(page: number, size: number, search: SkuManageSearch): Promise<SkuSelect[]> {
        const conditions = [];
        if (search.search) {
            const searchConditions = [
                eq(skuTable.bizId, search.search),
            ];

            if (!isNaN(Number(search.search))) {
                console.log(Number(search.search));
                searchConditions.unshift(eq(skuTable.id, Number(search.search)));
            }

            conditions.push(or(...searchConditions));
        }
        if (search.productId > 0) {
            conditions.push(eq(skuTable.productId, search.productId));
        }
        conditions.push(eq(skuTable.isDeleted, DeleteStatus.NotDeleted));

        return await this.conn.select().from(skuTable).where(
            and(...conditions)
        ).orderBy(desc(skuTable.id)).limit(size).offset((page - 1) * size);
    }

    async getSkuPageTotal(search: SkuManageSearch): Promise<number> {
        const conditions = [];
        if (search.search) {
            const searchConditions = [
                eq(skuTable.bizId, search.search),
            ];

            if (!isNaN(Number(search))) {
                searchConditions.unshift(eq(skuTable.id, Number(search)));
            }

            conditions.push(or(...searchConditions));
        }
        if (search.productId > 0) {
            conditions.push(eq(skuTable.productId, search.productId));
        }
        conditions.push(eq(skuTable.isDeleted, DeleteStatus.NotDeleted));

        const [result] = await this.conn.select({ count: count() }).from(skuTable).where(
            and(
                eq(skuTable.isDeleted, DeleteStatus.NotDeleted),
            )
        );
        return result.count;
    }

    async getSkuById(id: number): Promise<SkuSelect> {
        const [result] = await this.conn.select().from(skuTable).where(
            eq(skuTable.id, id)
        );
        return result;
    }

    async getSkuByBizId(bizId: string): Promise<SkuSelect> {
        const [result] = await this.conn.select().from(skuTable).where(
            eq(skuTable.bizId, bizId)
        );
        return result;
    }

    async getSkuListByProductId(productId: number): Promise<SkuSelect[]> {
        return await this.conn.select().from(skuTable).where(
            and(
                eq(skuTable.productId, productId),
                eq(skuTable.isDeleted, DeleteStatus.NotDeleted),
            )

        ).orderBy(desc(skuTable.weight));
    }

    async updateSkuById(id: number, data: SkuInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(skuTable).set(data).where(eq(skuTable.id, id));
    }

    async addSku(data: SkuInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(skuTable).values(data);
    }
}

export const skuDao = new SkuDao();
