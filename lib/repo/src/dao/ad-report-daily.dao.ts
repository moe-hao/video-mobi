import { database, type DatabaseConn } from "@lib/internal/database";
import { adReportDailyTable, type AdReportDailyInsert, type AdReportDailySelect } from "../models/ad-report-daily";
import { and, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

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
