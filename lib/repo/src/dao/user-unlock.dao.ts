import { database, type DatabaseConn } from "@lib/internal/database";
import { userUnlockTable, type UserUnlockInsert, type UserUnlockSelect } from "../models/user-unlock";
import { currentTime } from "@lib/common/utils/time";
import { and, count, desc, eq } from "drizzle-orm";

export class UserUnlockDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getUnlockListByUserId(page: number, size: number, userId: number): Promise<UserUnlockSelect[]> {
        return await this.conn.select().from(userUnlockTable).where(eq(userUnlockTable.userId, userId)).orderBy(desc(userUnlockTable.createTime)).offset((page - 1) * size).limit(size);
    }

    async getUnlockTotalByUserId(userId: number): Promise<number> {
        const result = await this.conn.select({ count: count() }).from(userUnlockTable).where(eq(userUnlockTable.userId, userId));
        return result[0].count;
    }

    async getUserUnlockByUserIdAndCollectionId(userId: number, collectionId: number): Promise<UserUnlockSelect[]> {
        return await this.conn.select().from(userUnlockTable).where(
            and(
                eq(userUnlockTable.userId, userId),
                eq(userUnlockTable.collectionId, collectionId),
            )
        );
    }

    async addUserUnlock(data: UserUnlockInsert) {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(userUnlockTable).values(data);
    }
}

export const userUnlockDao = new UserUnlockDao();
