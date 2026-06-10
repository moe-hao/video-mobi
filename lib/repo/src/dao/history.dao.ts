import { database, type DatabaseConn } from "@lib/internal/database";
import { historyTable, type HistoryInsert, type HistorySelect } from "../models/history";
import { and, count, desc, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";
import { DeleteStatus } from "@lib/common/consts/common-status";

class HistoryDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getHistoryPageByUserId(userId: number, page: number, size: number): Promise<HistorySelect[]> {
        return await this.conn.select().from(historyTable).where(
            and(
                eq(historyTable.userId, userId),
                eq(historyTable.isDeleted, DeleteStatus.NotDeleted)
            )
        ).orderBy(desc(historyTable.updateTime)).limit(size).offset((page - 1) * size);
    }

    async getHistoryCountByUserId(userId: number): Promise<number> {
        const [result] = await this.conn.select({ count: count() }).from(historyTable).where(
            and(
                eq(historyTable.userId, userId),
                eq(historyTable.isDeleted, DeleteStatus.NotDeleted)
            )
        );
        return result.count;
    }

    async getHistoryByUserIdAndCollection(userId: number, collectionId: number): Promise<HistorySelect> {
        const [result] = await this.conn.select().from(historyTable).where(
            and(
                eq(historyTable.userId, userId),
                eq(historyTable.collectionId, collectionId),
                eq(historyTable.isDeleted, DeleteStatus.NotDeleted)
            )
        );
        return result;
    }

    async getHistoryById(id: number): Promise<HistorySelect> {
        const [result] = await this.conn.select().from(historyTable).where(eq(historyTable.id, id));
        return result;
    }

    async addHistory(data: HistoryInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(historyTable).values(data);
    }

    async updateHistoryById(id: number, data: HistoryInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(historyTable).set(data).where(eq(historyTable.id, id));
    }
}

export const historyDao = new HistoryDao();
