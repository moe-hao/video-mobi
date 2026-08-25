import { decimal, int, mysqlTable } from "drizzle-orm/mysql-core";

export const ltvReportItemTable = mysqlTable("ltv_report_item", {
    id: int("id").primaryKey().autoincrement(),
    ltvReportId: int("ltv_report_id").notNull().default(0),
    week: int("week").notNull().default(0),
    cost: decimal("cost", { precision: 10, scale: 2 }).notNull().default('0.00'),
    income: decimal("income", { precision: 10, scale: 2 }).notNull().default('0.00'),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type LtvReportItemSelect = typeof ltvReportItemTable.$inferSelect;
export type LtvReportItemInsert = typeof ltvReportItemTable.$inferInsert;
