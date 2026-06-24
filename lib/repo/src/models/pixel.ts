import { int, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

export const pixelTable = mysqlTable("pixel", {
    id: int("id").primaryKey().autoincrement(),
    platfrom: tinyint("platfrom").notNull().default(0),
    name: varchar("name", { length: 256 }).notNull().default(""),
    pixelId: varchar("pixel_id", { length: 64 }).notNull().default(""),
    accessToken: varchar("access_token", { length: 512 }).notNull().default(""),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type PixelSelect = typeof pixelTable.$inferSelect;
export type PixelInsert = typeof pixelTable.$inferInsert;
