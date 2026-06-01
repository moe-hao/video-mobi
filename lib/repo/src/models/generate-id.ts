import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const generateIdTable = mysqlTable("generate_id", {
    id: int("id").primaryKey().autoincrement(),
    busniessName: varchar("busniess_name", { length: 64 }).default(""),
    key: varchar("key", { length: 64 }).default(""),
    currentId: int("current_id").default(1),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type GenerateIdSelect = typeof generateIdTable.$inferSelect;
export type GenerateIdInsert = typeof generateIdTable.$inferInsert;
