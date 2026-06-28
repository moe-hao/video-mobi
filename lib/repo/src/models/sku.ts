import { char, decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const skuTable = mysqlTable("sku", {
    id: int("id").primaryKey().autoincrement(),
    bizId: char("biz_id", { length: 32 }).notNull().default(""),
    price: decimal("price", { precision: 6, scale: 2 }).notNull().default('0.00'),
    skuType: varchar("sku_type", { length: 20 }).notNull().default(""),
    periodType: varchar("period_type", { length: 2 }).notNull().default(""),
    periodTotal: int("period_total").notNull().default(0),
    paypalPlanId: varchar("paypal_plan_id", { length: 30 }).notNull().default(""),
    productId: int("product_id").notNull().default(0),
    weight: int("weight").notNull().default(0),
    coinNum: int("coin_num").notNull().default(0),
    desc: varchar("desc", { length: 256 }).notNull().default(""),
    important: int("important").notNull().default(0),
    isDeleted: int("is_deleted").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type SkuSelect = typeof skuTable.$inferSelect;
export type SkuInsert = typeof skuTable.$inferInsert;
