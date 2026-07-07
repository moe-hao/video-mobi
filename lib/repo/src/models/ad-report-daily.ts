import { date, decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const adReportDailyTable = mysqlTable("ad_report_daily", {
    id: int("id").primaryKey().autoincrement(),
    date: date("date", { mode: "string" }).notNull().default('1000-01-01'),
    ad_account_name: varchar("ad_account_name", { length: 256 }).notNull().default(''),
    campaign_id: varchar("campaign_id", { length: 64 }).notNull().default(''),
    campaign_name: varchar("campaign_name", { length: 640 }).notNull().default(''),
    adset_id: varchar("adset_id", { length: 64 }).notNull().default(''),
    adset_name: varchar("adset_name", { length: 256 }).notNull().default(''),
    ad_id: varchar("ad_id", { length: 64 }).notNull().default(''),
    ad_name: varchar("ad_name", { length: 256 }).notNull().default(''),
    collection_name: varchar("collection_name", { length: 256 }).notNull().default(''),
    region: varchar("region", { length: 10 }).notNull().default(''),
    spend: decimal("spend", { precision: 10, scale: 2 }).notNull().default('0.00'),
    impressions: int("impressions").notNull().default(0),
    clicks: int("clicks").notNull().default(0),
    cpm: decimal("cpm", { precision: 10, scale: 6 }).notNull().default('0.000000'),
    clicks_num: int("clicks_num").notNull().default(0),
    cpc: decimal("cpc", { precision: 10, scale: 6 }).notNull().default('0.000000'),
    ctr: decimal("ctr", { precision: 10, scale: 6 }).notNull().default('0.000000'),
    video_p25: int("video_p25").notNull().default(0),
    video_p50: int("video_p50").notNull().default(0),
    video_p100: int("video_p100").notNull().default(0),
});

export type AdReportDailySelect = typeof adReportDailyTable.$inferSelect;
export type AdReportDailyInsert = typeof adReportDailyTable.$inferInsert;
