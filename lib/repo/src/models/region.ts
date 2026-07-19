import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const regionTable = mysqlTable("region", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 128 }).notNull().default(""),
    currency: varchar("currency", { length: 10 }).notNull().default(""),
    currencySign: varchar("currency_sign", { length: 10 }).notNull().default(""),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type RegionSelect = typeof regionTable.$inferSelect;
export type RegionInsert = typeof regionTable.$inferInsert;
