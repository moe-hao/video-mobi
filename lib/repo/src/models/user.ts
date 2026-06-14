import { char, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { UserType } from "@lib/common/consts/user";

export const userTable = mysqlTable("user", {
    id: int("id").primaryKey().autoincrement(),
    bizId: char("biz_id", { length: 32 }).unique().notNull().default(""),
    username: varchar("username", { length: 256 }).notNull().default(""),
    password: varchar("password", { length: 128 }).notNull().default(""),
    email: varchar("email", { length: 256 }).notNull().default(""),
    authToken: varchar("auth_token", { length: 64 }).notNull().default(""),
    userType: int("user_type").notNull().default(UserType.Guest),
    productId: int("product_id").notNull().default(0),
    isDeleted: int("is_deleted").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type UserSelect = typeof userTable.$inferSelect;
export type UserInsert = typeof userTable.$inferInsert;
