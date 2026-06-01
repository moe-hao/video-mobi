import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const videoTable = mysqlTable("video", {
    id: int("id").primaryKey().autoincrement(),
    collectionId: int("collection_id").notNull().default(0),
    epNum: int("ep_num").notNull().default(0),
    vid: varchar("vid", { length: 40 }).notNull().default(""),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type VideoSelect = typeof videoTable.$inferSelect;
export type VideoInsert = typeof videoTable.$inferInsert;
