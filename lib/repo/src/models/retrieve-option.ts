import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const retrieveOptionTable = mysqlTable("retrieve_option", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 128 }).notNull().default(""),
    orderNum: int("order_num").notNull().default(0),
    openPaymentNum: int("open_payment_num").notNull().default(0),
    relation: varchar("relation", { length: 8 }).notNull().default(""),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type RetrieveOptionSelect = typeof retrieveOptionTable.$inferSelect;
export type RetrieveOptionInsert = typeof retrieveOptionTable.$inferInsert;

