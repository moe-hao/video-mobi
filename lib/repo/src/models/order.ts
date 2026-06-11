import { char, decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const orderTable = mysqlTable("order", {
    id: int("id").primaryKey().autoincrement(),
    bizId: char("biz_id", { length: 32 }).notNull().default(""),
    userId: int("user_id").notNull().default(0),
    amount: decimal("amount", { precision: 6, scale: 2 }).notNull().default('0.00'),
    currency: varchar("currency", { length: 10 }).notNull().default(''),
    skuId: int("sku_id").notNull().default(0),
    productId: int("product_id").notNull().default(0),
    paymentId: varchar('payment_id', { length: 40 }).notNull().default(''),
    subscriptionId: int("subscription_id").notNull().default(0),
    subscriptionCount: int("subscription_count").notNull().default(0),
    paymentChannel: varchar("payment_channel", { length: 50 }).notNull().default(""),
    paymentType: varchar("payment_type", { length: 50 }).notNull().default(""),
    orderStatus: int("order_status").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type OrderSelect = typeof orderTable.$inferSelect;
export type OrderInsert = typeof orderTable.$inferInsert;
