import { database, type DatabaseConn } from "@lib/internal/database";
import { adReportDailyTable, type AdReportDailyInsert, type AdReportDailySelect } from "../models/ad-report-daily";
import { and, count, desc, eq, like } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

export type SearchAdReportDaily = {
    date: string;
    adAccountId: string;
    campaignId: string;
    adId: string;
}

export class AdReportDailyDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getAdReportDailyByDateAndAdId(date: string, adId: string): Promise<AdReportDailySelect> {
        const [result] = await this.conn.select().from(adReportDailyTable).where(
            and(
                eq(adReportDailyTable.date, date),
                eq(adReportDailyTable.adId, adId),
            )
        );

        return result;
    }

    private buildSearchConditions(search: SearchAdReportDaily) {
        const conditions = [];
        if (search.date) {
            conditions.push(eq(adReportDailyTable.date, search.date));
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
        return conditions;
    }

    async getAdReportDailyListPage(page: number, size: number, search: SearchAdReportDaily): Promise<AdReportDailySelect[]> {
        const conditions = this.buildSearchConditions(search);
        return await this.conn.select().from(adReportDailyTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(desc(adReportDailyTable.id))
            .offset((page - 1) * size)
            .limit(size);
    }

    async getAdReportDailyListTotal(search: SearchAdReportDaily): Promise<number> {
        const conditions = this.buildSearchConditions(search);
        const [result] = await this.conn.select({ count: count() }).from(adReportDailyTable)
            .where(conditions.length ? and(...conditions) : undefined);
        return result.count;
    }

    async addAdReportDailyList(list: AdReportDailyInsert[]): Promise<void> {
        list.forEach(item => {
            item.createTime = currentTime();
            item.updateTime = currentTime();
        });
        await this.conn.insert(adReportDailyTable).values(list);
    }

    async updateAdReportDaily(date: string, adId: string, data: AdReportDailyInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(adReportDailyTable).set(data).where(
            and(
                eq(adReportDailyTable.date, date),
                eq(adReportDailyTable.adId, adId),
            )
        );
    }
}

export const adReportDailyDao = new AdReportDailyDao();
