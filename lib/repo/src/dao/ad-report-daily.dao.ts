import { database, type DatabaseConn } from "@lib/internal/database";
import { adReportDailyTable, type AdReportDailyInsert, type AdReportDailySelect } from "../models/ad-report-daily";
import { and, asc, count, desc, eq, inArray, like, sum, ne, type AnyColumn } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";
import { between } from "drizzle-orm/sql";

export type SearchAdReportDaily = {
    date: string;
    platform: string;
    adAccountId: string;
    campaignId: string;
    adId: string;
    region: string;
};

export type ReportUpdateCondition = {
    platform: number;
    date: string;
    adId: string;
    region: string;
};

export class AdReportDailyDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getAdReportDailyByDateAndAdId(condition: ReportUpdateCondition): Promise<AdReportDailySelect> {
        const [result] = await this.conn.select().from(adReportDailyTable).where(
            and(
                eq(adReportDailyTable.platform, condition.platform),
                eq(adReportDailyTable.date, condition.date),
                eq(adReportDailyTable.adId, condition.adId),
                eq(adReportDailyTable.region, condition.region),
            )
        );

        return result;
    }

    private buildSearchConditions(search: SearchAdReportDaily) {
        const conditions = [];
        if (search.date) {
            conditions.push(eq(adReportDailyTable.date, search.date));
        }
        if (search.platform) {
            conditions.push(eq(adReportDailyTable.platform, Number(search.platform)));
        }
        if (search.adAccountId) {
            conditions.push(like(adReportDailyTable.adAccountId, `%${search.adAccountId}%`));
        }
        if (search.campaignId) {
            conditions.push(like(adReportDailyTable.campaignId, `%${search.campaignId}%`));
        }
        if (search.adId) {
            conditions.push(like(adReportDailyTable.adId, `%${search.adId}%`));
        }
        if (search.region) {
            conditions.push(eq(adReportDailyTable.region, search.region));
        }
        return conditions;
    }

    async getAdReportDailyListPage(
        page: number, size: number, search: SearchAdReportDaily,
        sortField: string = 'spend', sortDir: 'asc' | 'desc' = 'desc'
    ): Promise<AdReportDailySelect[]> {
        const conditions = this.buildSearchConditions(search);
        const orderColumns: Record<string, AnyColumn> = {
            spend: adReportDailyTable.spend,
            purchasesConversionValue: adReportDailyTable.purchasesConversionValue,
            id: adReportDailyTable.id,
        };

        const orderCol = orderColumns[sortField] ?? adReportDailyTable.date;
        const orderFn = sortDir === 'asc' ? asc : desc;
        return await this.conn.select().from(adReportDailyTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(orderFn(orderCol))
            .offset((page - 1) * size)
            .limit(size);
    }

    async getAdReportDailyListTotal(search: SearchAdReportDaily): Promise<{ count: number, spend: string, purchasesConversionValue: string, purchaseConversionCount: number }> {
        const conditions = this.buildSearchConditions(search);
        const [result] = await this.conn.select({ count: count(), spend: sum(adReportDailyTable.spend), purchasesConversionValue: sum(adReportDailyTable.purchasesConversionValue), purchaseConversionCount: sum(adReportDailyTable.purchaseConversionCount) }).from(adReportDailyTable)
            .where(conditions.length ? and(...conditions) : undefined);
        return { count: result.count, spend: result.spend ?? '0', purchasesConversionValue: result.purchasesConversionValue ?? '0', purchaseConversionCount: Number(result.purchaseConversionCount ?? 0) };
    }

    async addAdReportDailyList(list: AdReportDailyInsert[]): Promise<void> {
        list.forEach(item => {
            item.createTime = currentTime();
            item.updateTime = currentTime();
        });
        await this.conn.insert(adReportDailyTable).values(list);
    }

    async updateAdReportDaily(condition: ReportUpdateCondition, data: AdReportDailyInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(adReportDailyTable).set(data).where(
            and(
                eq(adReportDailyTable.date, condition.date),
                eq(adReportDailyTable.platform, condition.platform),
                eq(adReportDailyTable.adId, condition.adId),
                eq(adReportDailyTable.region, condition.region),
            )
        );
    }

    async getAdReportDailySummary(date: string, platform?: string) {
        const conditions = [eq(adReportDailyTable.date, date)];
        if (platform) {
            conditions.push(eq(adReportDailyTable.platform, Number(platform)));
        }
        const [result] = await this.conn
            .select({
                spend: sum(adReportDailyTable.spend),
                purchasesConversionValue: sum(adReportDailyTable.purchasesConversionValue),
                purchaseConversionCount: sum(adReportDailyTable.purchaseConversionCount),
            }).from(adReportDailyTable).where(and(...conditions));
        return result;
    }

    async getSpendByDates(dates: string[]): Promise<Map<string, string>> {
        if (dates.length === 0) return new Map();
        const rows = await this.conn
            .select({
                date: adReportDailyTable.date,
                spend: sum(adReportDailyTable.spend),
            })
            .from(adReportDailyTable)
            .where(inArray(adReportDailyTable.date, dates))
            .groupBy(adReportDailyTable.date);
        const map = new Map<string, string>();
        for (const row of rows) {
            map.set(row.date, row.spend ?? '0');
        }
        return map;
    }

    private buildGroupConditions(start: string, end: string, country: string, platform: number) {
        const conditions = [
            ne(adReportDailyTable.region, 'None'),
            ne(adReportDailyTable.region, 'unknown'),
        ];
        if (start && end) {
            conditions.push(between(adReportDailyTable.date, start, end));
        }
        if (platform) {
            conditions.push(eq(adReportDailyTable.platform, platform));
        }
        if (country) {
            conditions.push(eq(adReportDailyTable.region, country));
        }
        return conditions;
    }

    async getAdReportDailyGroup(start: string, end: string, country: string, platform: number, page: number, size: number): Promise<{
        date: string;
        region: string;
        spendSum: number;
        purchaseConversionCountSum: number;
        purchasesConversionValueSum: number;
        impressionsSum: number;
        clicksNumSum: number;
    }[]> {
        const conditions = this.buildGroupConditions(start, end, country, platform);
        const rows = await this.conn.select({
            date: adReportDailyTable.date,
            region: adReportDailyTable.region,
            spendSum: sum(adReportDailyTable.spend),
            purchaseConversionCountSum: sum(adReportDailyTable.purchaseConversionCount),
            purchasesConversionValueSum: sum(adReportDailyTable.purchasesConversionValue),
            impressionsSum: sum(adReportDailyTable.impressions),
            clicksNumSum: sum(adReportDailyTable.clicksNum),
        }).from(adReportDailyTable).where(and(...conditions)).groupBy(adReportDailyTable.date, adReportDailyTable.region).orderBy(desc(adReportDailyTable.date)).offset((page - 1) * size).limit(size);

        return rows.map(row => ({
            date: row.date,
            region: row.region,
            spendSum: Number(row.spendSum ?? 0),
            purchaseConversionCountSum: Number(row.purchaseConversionCountSum ?? 0),
            purchasesConversionValueSum: Number(row.purchasesConversionValueSum ?? 0),
            impressionsSum: Number(row.impressionsSum ?? 0),
            clicksNumSum: Number(row.clicksNumSum ?? 0),
        }));
    }

    async getAdReportDailyGroupTotal(start: string, end: string, country: string, platform: number): Promise<number> {
        const conditions = this.buildGroupConditions(start, end, country, platform);
        const rows = await this.conn.select({ date: adReportDailyTable.date, region: adReportDailyTable.region })
            .from(adReportDailyTable)
            .where(and(...conditions))
            .groupBy(adReportDailyTable.date, adReportDailyTable.region);
        return rows.length;
    }
}

export const adReportDailyDao = new AdReportDailyDao();
