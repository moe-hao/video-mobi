import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const productTable = mysqlTable("product", {
    id: int("id").primaryKey().autoincrement(),
    host: varchar("host", { length: 256 }).notNull().default(""),
    region: varchar("region", { length: 10 }).notNull().default(""),
    language: varchar("language", { length: 10 }).notNull().default(""),
    currency: varchar("currency", { length: 10 }).notNull().default(""),
    currencySign: varchar("currency_sign", { length: 5 }).notNull().default(""),
    collectionTypeList: varchar("collection_type_list", { length: 128 }).notNull().default(""),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type ProductSelect = typeof productTable.$inferSelect;
export type ProductInsert = typeof productTable.$inferInsert;
