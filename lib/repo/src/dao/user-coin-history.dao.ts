import { database, type DatabaseConn } from "@lib/internal/database";
import { userCoinHistoryTable, type UserCoinHistoryInsert, type UserCoinHistorySelect } from "../models/user-coin-history";
import { currentTime } from "@lib/common/utils/time";
import { and, count, desc, eq } from "drizzle-orm";

export class UserCoinHistoryDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getCoinHistoryListByUserId(page: number, size: number, userId: number): Promise<UserCoinHistorySelect[]> {
        return await this.conn.select().from(userCoinHistoryTable).where(eq(userCoinHistoryTable.userId, userId)).orderBy(desc(userCoinHistoryTable.createTime)).offset((page - 1) * size).limit(size);
    }

    async getCoinHistoryTotalByUserId(userId: number): Promise<number> {
        const result = await this.conn.select({ count: count() }).from(userCoinHistoryTable).where(eq(userCoinHistoryTable.userId, userId));
        return result[0].count;
    }

    async getCoinHistoryListByUserIdAndCollectionId(userId: number, collectionId: number): Promise<UserCoinHistorySelect[]> {
        return await this.conn.select().from(userCoinHistoryTable).where(
            and(
                eq(userCoinHistoryTable.userId, userId),
                eq(userCoinHistoryTable.collectionId, collectionId),
            )
        );
    }

    async addUserCoinHistory(data: UserCoinHistoryInsert) {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(userCoinHistoryTable).values(data);
    }
}

export const userCoinHistoryDao = new UserCoinHistoryDao();
