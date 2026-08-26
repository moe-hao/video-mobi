import { database, type DatabaseConn } from "@lib/internal/database";
import { ltvReportTable, type LtvReportInsert, type LtvReportSelect } from "../models/ltv-report";
import { and, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

type LtvReportSearch = {
    startDate: string;
    productId: number;
    paymentChannel: string;
    paymentType: string;
    day: number;
};

class LtvReportDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getReport(search: LtvReportSearch): Promise<LtvReportSelect> {
        const [result] = await this.conn.select().from(ltvReportTable).where(
            and(
                eq(ltvReportTable.startDate, search.startDate),
                eq(ltvReportTable.productId, search.productId),
                eq(ltvReportTable.paymentChannel, search.paymentChannel),
                eq(ltvReportTable.paymentType, search.paymentType),
                eq(ltvReportTable.day, search.day),
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

    async updateReport(id: number, data: LtvReportInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(ltvReportTable).set(data).where(
            eq(ltvReportTable.id, id),
        );
    }
}

export const ltvReportDao = new LtvReportDao();
