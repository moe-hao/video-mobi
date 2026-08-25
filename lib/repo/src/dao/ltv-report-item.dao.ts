import { database, type DatabaseConn } from "@lib/internal/database";
import { ltvReportItemTable, type LtvReportItemInsert, type LtvReportItemSelect } from "../models/ltv-report-item";
import { and, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

class LtvReportItemDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getReportItemByReportIdAndWeek(reportId: number, week: number): Promise<LtvReportItemSelect> {
        const [result] = await this.conn.select().from(ltvReportItemTable).where(
            and(
                eq(ltvReportItemTable.ltvReportId, reportId),
                eq(ltvReportItemTable.week, week)
            )
        );
        return result;
    }

    async insertReportItem(data: LtvReportItemInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(ltvReportItemTable).values(data);
    }
}

export const ltvReportItemDao = new LtvReportItemDao();
