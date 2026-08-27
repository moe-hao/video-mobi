import { database, type DatabaseConn } from "@lib/internal/database";
import { ltvReportTable, type LtvReportInsert, type LtvReportSelect } from "../models/ltv-report";
import { and, between, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

type LtvReportSearch = {
    startDate: string;
    productId: number;
    paymentChannel: string;
    paymentType: string;
    day: number;
};

export type LtvReportListSearch = {
    startDateBegin: string;
    startDateEnd: string;
    productId: number;
    paymentChannel: string;
    paymentType: string;
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

    private buildListConditions(search: LtvReportListSearch) {
        const conditions = [];
        if (search.startDateBegin && search.startDateEnd) {
            conditions.push(between(ltvReportTable.startDate, search.startDateBegin, search.startDateEnd));
        }
        if (search.productId) {
            conditions.push(eq(ltvReportTable.productId, search.productId));
        }
        if (search.paymentChannel) {
            conditions.push(eq(ltvReportTable.paymentChannel, search.paymentChannel));
        }
        if (search.paymentType) {
            conditions.push(eq(ltvReportTable.paymentType, search.paymentType));
        }
        conditions.push(between(ltvReportTable.day, 0, 56));
        return conditions;
    }

    async getLtvReportList(search: LtvReportListSearch): Promise<LtvReportSelect[]> {
        const conditions = this.buildListConditions(search);
        return await this.conn.select().from(ltvReportTable)
            .where(and(...conditions))
            .orderBy(ltvReportTable.startDate, ltvReportTable.productId, ltvReportTable.paymentChannel, ltvReportTable.paymentType, ltvReportTable.day);
    }
}

export const ltvReportDao = new LtvReportDao();
