import { date, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const subscriptionRenewalReportTable = mysqlTable("subscription_renewal_report", {
    id: int('id').primaryKey().notNull().autoincrement(),
    date: date('date', { mode: 'string' }).notNull().default('1000-01-01'),
    productId: int('product_id').notNull().default(0),
    paymentChannel: varchar('payment_channel', { length: 20 }).notNull().default(''),
    paymentType: varchar('payment_type', { length: 20 }).notNull().default(''),
    periodType: varchar('period_type', { length: 20 }).notNull().default(''),
    periodNum: int('period_num').notNull().default(0),
    subscriptionNum: int('subscription_num').notNull().default(0),
    createTime: int('create_time').notNull().default(0),
    updateTime: int('update_time').notNull().default(0),
});

export type SubscriptionRenewalReportTableSelect = typeof subscriptionRenewalReportTable.$inferSelect;
export type SubscriptionRenewalReportTableInsert = typeof subscriptionRenewalReportTable.$inferInsert;
