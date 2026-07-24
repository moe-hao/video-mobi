import { DeleteStatus } from "@lib/common/consts/common-status";
import { int, mysqlTable, tinyint } from "drizzle-orm/mysql-core";

export const userLikeTable = mysqlTable("user_like", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").default(0),
    collectionId: int("collection_id").default(0),
    isDeleted: tinyint("is_deleted").default(DeleteStatus.NotDeleted),
    createTime: int("create_time").default(0),
    updateTime: int("update_time").default(0),
});

export type UserLikeSelect = typeof userLikeTable.$inferSelect;
export type UserLikeInsert = typeof userLikeTable.$inferInsert;
