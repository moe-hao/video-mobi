import { database, type DatabaseConn } from "@lib/internal/database";
import { ltvReportTable, type LtvReportInsert, type LtvReportSelect } from "../models/ltv-report";
import { and, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

type LtvReportSearch = {
    date: string;
    productId: number;
    paymentChannel: string;
    paymentType: string;
};

class LtvReportDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getReport(search: LtvReportSearch): Promise<LtvReportSelect> {
        const [result] = await this.conn.select().from(ltvReportTable).where(
            and(
                eq(ltvReportTable.date, search.date),
                eq(ltvReportTable.productId, search.productId),
                eq(ltvReportTable.paymentChannel, search.paymentChannel),
                eq(ltvReportTable.paymentType, search.paymentType),
            )
        );
        return result;
    }

    async insertReport(report: LtvReportInsert): Promise<number> {
        report.createTime = currentTime();
        report.updateTime = currentTime();
        const [result] = await this.conn.insert(ltvReportTable).values(report);
        return result.insertId;
    }
}

export const ltvReportDao = new LtvReportDao();
