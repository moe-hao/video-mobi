import { and, count, desc, eq, like, or } from "drizzle-orm";
import { database, type DatabaseConn } from "@lib/internal/database";
import { regionTable, type RegionInsert } from "../models/region";
import { currentTime } from "@lib/common/utils/time";

export class RegionDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    private buildSearchConditions(search: string) {
        const conditions = [];
        if (search) {
            const searchConditions = [];
            if (!isNaN(Number(search))) {
                searchConditions.push(eq(regionTable.id, Number(search)));
            }
            searchConditions.push(like(regionTable.name, `%${search}%`));
            conditions.push(or(...searchConditions)!);
        }
        return conditions.length > 0 ? [and(...conditions)] : [];
    }

    async getRegionPageList(page: number, size: number, search: string) {
        const conditions = this.buildSearchConditions(search);
        return await this.conn.select().from(regionTable)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(regionTable.id))
            .offset((page - 1) * size)
            .limit(size);
    }

    async getRegionTotal(search: string): Promise<number> {
        const conditions = this.buildSearchConditions(search);
        const [result] = await this.conn.select({ count: count() }).from(regionTable)
            .where(conditions.length > 0 ? and(...conditions) : undefined);
        return result.count;
    }

    async addRegion(data: RegionInsert): Promise<number> {
        const nowTime = currentTime();
        const [result] = await this.conn.insert(regionTable).values({
            ...data,
            createTime: nowTime,
            updateTime: nowTime,
        });
        return result.insertId;
    }

    async updateRegionById(id: number, data: RegionInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(regionTable).set(data).where(eq(regionTable.id, id));
    }

    async deleteRegionById(id: number): Promise<void> {
        await this.conn.delete(regionTable).where(eq(regionTable.id, id));
    }
}

export const regionDao = new RegionDao();
