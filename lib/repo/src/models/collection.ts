import { char, int, mysqlTable, text, tinyint, varchar } from "drizzle-orm/mysql-core";
import { CollectionType, PublishStatus } from "@lib/common/consts/collection";

export const collectionTable = mysqlTable("collection", {
    id: int("id").primaryKey().autoincrement(),
    bizId: char("biz_id", { length: 32 }).unique().notNull().default(""),
    name: varchar("name", { length: 512 }).notNull().default(""),
    sourceName: varchar("source_name", { length: 512 }).notNull().default(""),
    episodes: int("episodes").notNull().default(0),
    cover: varchar("cover", { length: 512 }).notNull().default(""),
    language: varchar("language", { length: 4 }).notNull().default(""),
    videoId: int("video_id").notNull().default(0),
    cutPoint: int("cut_point").notNull().default(0),
    publishStatus: tinyint("publish_status").notNull().default(PublishStatus.Unpublished),
    collectionType: tinyint("collection_type").notNull().default(CollectionType.Normal),
    local: tinyint("local").notNull().default(0),
    desc: text("desc").notNull().default(""),
    mockLike: int("mock_like").notNull().default(0),
    isDeleted: int("is_deleted").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type CollectionSelect = typeof collectionTable.$inferSelect;
export type CollectionInsert = typeof collectionTable.$inferInsert;
