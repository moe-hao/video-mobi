import { and, count, desc, eq, like, or } from "drizzle-orm";
import { retrieveOptionTable, type RetrieveOptionInsert, type RetrieveOptionSelect } from "../models/retrieve-option";
import { database, type DatabaseConn } from "@lib/internal/database";
import { currentTime } from "@lib/common/utils/time";
import { DeleteStatus } from "@lib/common/consts/common-status";

export type RetrieveOptionListSearch = {
    search: string;
}

class RetrieveOptionDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getRetrieveOptionPage(page: number, size: number, search: RetrieveOptionListSearch): Promise<RetrieveOptionSelect[]> {
        const conditions = this.buildSearchConditions(search);
        conditions.push(eq(retrieveOptionTable.isDeleted, DeleteStatus.NotDeleted));
        return await this.conn.select().from(retrieveOptionTable)
            .where(and(...conditions))
            .orderBy(desc(retrieveOptionTable.id))
            .offset((page - 1) * size)
            .limit(size);
    }

    async getRetrieveOptionCount(search: RetrieveOptionListSearch): Promise<number> {
        const conditions = this.buildSearchConditions(search);
        conditions.push(eq(retrieveOptionTable.isDeleted, DeleteStatus.NotDeleted));
        const [result] = await this.conn.select({ count: count() }).from(retrieveOptionTable)
            .where(and(...conditions));
        return result.count;
    }

    private buildSearchConditions(search: RetrieveOptionListSearch) {
        const conditions = [];
        if (search.search) {
            const searchConditions = [
                like(retrieveOptionTable.name, `%${search.search}%`),
                like(retrieveOptionTable.relation, `%${search.search}%`),
            ];
            if (!isNaN(Number(search.search))) {
                searchConditions.unshift(eq(retrieveOptionTable.id, Number(search.search)));
            }
            conditions.push(or(...searchConditions));
        }
        return conditions;
    }

    async updateRetrieveOptionById(id: number, data: RetrieveOptionInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(retrieveOptionTable).set(data).where(
            eq(retrieveOptionTable.id, id)
        );
    }

    async addRetrieveOption(data: RetrieveOptionInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(retrieveOptionTable).values(data);
    }

}

export const retrieveOptionDao = new RetrieveOptionDao();
