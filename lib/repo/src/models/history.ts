import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const historyTable = mysqlTable("history", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().default(0),
    collectionId: int("collection_id").notNull().default(0),
    epNum: int("ep_num").notNull().default(0),
    isDeleted: int("is_deleted").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type HistorySelect = typeof historyTable.$inferSelect;
export type HistoryInsert = typeof historyTable.$inferInsert;
