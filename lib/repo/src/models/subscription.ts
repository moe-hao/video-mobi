import { SubscriptionStatus } from "@lib/common/consts/subscription";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const subscriptionTable = mysqlTable("subscription", {
    id: int("id").primaryKey().autoincrement(),
    bizId: varchar("biz_id", { length: 40 }).notNull().default(""),
    userId: int("user_id").notNull().default(0),
    subscriptionNo: varchar("subscription_no", { length: 30 }).notNull().default(""),
    subscriptionStatus: int("subscription_status").notNull().default(SubscriptionStatus.InActive),
    subscriptionChannel: varchar("subscription_channel", { length: 30 }).notNull().default(""),
    skuId: int("sku_id").notNull().default(0),
    productId: int("product_id").notNull().default(0),
    pixelId: int("pixel_id").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type SubscriptionSelect = typeof subscriptionTable.$inferSelect;
export type SubscriptionInsert = typeof subscriptionTable.$inferInsert;
