import { DeleteStatus } from "@lib/common/consts/common-status";
import { int, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

export const paymentOptionTable = mysqlTable("payment_option", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull().default(""),
    isDeleted: tinyint("is_deleted").notNull().default(DeleteStatus.NotDeleted),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type PaymentOptionSelect = typeof paymentOptionTable.$inferSelect;
export type PaymentOptionInsert = typeof paymentOptionTable.$inferInsert;
