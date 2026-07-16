
import { int, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

export const paymentOptionItemTable = mysqlTable("payment_option_item", {
    id: int("id").primaryKey().autoincrement(),
    paymentOptionId: int("payment_option_id").notNull().default(0),
    paymentType: varchar("payment_type", { length: 20 }).notNull().default(""),
    paymentChannel: varchar("payment_channel", { length: 20 }).notNull().default(""),
    sort: int("sort").notNull().default(0),
    isDeleted: tinyint("is_deleted").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type PaymentOptionItemSelect = typeof paymentOptionItemTable.$inferSelect;
export type PaymentOptionItemInsert = typeof paymentOptionItemTable.$inferInsert;
