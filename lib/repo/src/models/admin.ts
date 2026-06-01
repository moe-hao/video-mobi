import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const adminTable = mysqlTable("admin", {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 64 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type AdminSelect = typeof adminTable.$inferSelect;
export type AdminInsert = typeof adminTable.$inferInsert;
