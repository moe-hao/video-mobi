import { date, decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const adReportDailyTable = mysqlTable("ad_report_daily", {
    id: int("id").primaryKey().autoincrement(),
    date: date("date", { mode: "string" }).notNull().default('1000-01-01'),
    adAccountId: varchar("ad_account_id", { length: 64 }).notNull().default(''),
    adAccountName: varchar("ad_account_name", { length: 256 }).notNull().default(''),
    campaignId: varchar("campaign_id", { length: 64 }).notNull().default(''),
    campaignName: varchar("campaign_name", { length: 640 }).notNull().default(''),
    adsetId: varchar("adset_id", { length: 64 }).notNull().default(''),
    adsetName: varchar("adset_name", { length: 256 }).notNull().default(''),
    adId: varchar("ad_id", { length: 64 }).notNull().default(''),
    adName: varchar("ad_name", { length: 256 }).notNull().default(''),
    region: varchar("region", { length: 10 }).notNull().default(''),
    spend: decimal("spend", { precision: 10, scale: 2 }).notNull().default('0.00'),
    impressions: int("impressions").notNull().default(0),
    clicks: int("clicks").notNull().default(0),
    cpm: decimal("cpm", { precision: 10, scale: 6 }).notNull().default('0.000000'),
    clicksNum: int("clicks_num").notNull().default(0),
    cpc: decimal("cpc", { precision: 10, scale: 6 }).notNull().default('0.000000'),
    ctr: decimal("ctr", { precision: 10, scale: 6 }).notNull().default('0.000000'),
    videoP25: int("video_p25").notNull().default(0),
    videoP50: int("video_p50").notNull().default(0),
    videoP100: int("video_p100").notNull().default(0),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
});

export type AdReportDailySelect = typeof adReportDailyTable.$inferSelect;
export type AdReportDailyInsert = typeof adReportDailyTable.$inferInsert;
