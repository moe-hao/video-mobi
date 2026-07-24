import { database, type DatabaseConn } from "@lib/internal/database";
import { userLikeTable, type UserLikeInsert, type UserLikeSelect } from "../models/user-like";
import { currentTime } from "@lib/common/utils/time";
import { and, count, eq } from "drizzle-orm";
import { DeleteStatus } from "@lib/common/consts/common-status";

export class UserLikeDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getUserLikeByUserIdAndCollectionId(userId: number, collectionId: number): Promise<UserLikeSelect> {
        const [result] = await this.conn.select().from(userLikeTable).where(and(
            eq(userLikeTable.userId, userId),
            eq(userLikeTable.collectionId, collectionId),
            eq(userLikeTable.isDeleted, DeleteStatus.NotDeleted),
        ));
        return result;
    }

    async getUserLikeTotalByCollectionId(collectionId: number): Promise<number> {
        const [result] = await this.conn.select({ count: count() }).from(userLikeTable).where(and(
            eq(userLikeTable.collectionId, collectionId),
            eq(userLikeTable.isDeleted, DeleteStatus.NotDeleted),
        ));
        return result.count;
    }

    async addUserLike(data: UserLikeInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        data.isDeleted = DeleteStatus.NotDeleted;
        await this.conn.insert(userLikeTable).values(data);
    }

    async updateUserLike(id: number, data: UserLikeInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(userLikeTable).set(data).where(eq(userLikeTable.id, id));
    }
}

export const userLikeDao = new UserLikeDao();
