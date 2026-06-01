import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const collectionFeatureTable = mysqlTable("collection_feature", {
    id: int("id").primaryKey().autoincrement(),
    collectionId: int("collection_id").notNull().default(0),
    weight: int("weight").notNull().default(0),
    isDeleted: int("is_deleted").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type CollectionFeatureSelect = typeof collectionFeatureTable.$inferSelect;
export type CollectionFeatureInsert = typeof collectionFeatureTable.$inferInsert;
