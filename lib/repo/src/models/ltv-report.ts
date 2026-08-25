import { date, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const ltvReportTable = mysqlTable("ltv_report", {
    id: int("id").primaryKey().autoincrement(),
    date: date("date", { mode: "string" }).notNull().default('1000-01-01'),
    productId: int("product_id").notNull().default(0),
    paymentChannel: varchar("payment_channel", { length: 20 }).notNull().default(''),
    paymentType: varchar("payment_type", { length: 20 }).notNull().default(''),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type LtvReportSelect = typeof ltvReportTable.$inferSelect;
export type LtvReportInsert = typeof ltvReportTable.$inferInsert;
