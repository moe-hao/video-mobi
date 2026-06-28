import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const memberTable = mysqlTable("member", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().default(0),
    expireTime: int("expire_time").notNull().default(0),
    coinNum: int("coin_num").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type MemberSelect = typeof memberTable.$inferSelect;
export type MemberInsert = typeof memberTable.$inferInsert;
