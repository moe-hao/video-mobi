import { database, type DatabaseConn } from "@lib/internal/database";
import { subscriptionRenewalReportTable, type SubscriptionRenewalReportTableInsert, type SubscriptionRenewalReportTableSelect } from "../models/subscription-renewal-report";
import type { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { and, asc, eq, inArray, sum } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";
import type { PeriodType } from "@lib/common/consts/subscription";

export type GetSubscriptionRenewalReportCondition = {
    date: string,
    productId: number,
    paymentChannel: PaymentChannel,
    paymentType: PaymentType,
    periodType: PeriodType,
    periodNum: number,
};

export type SearchSubscriptionRenewalReport = {
    date: string;
    productIds: string;
    paymentChannel: string;
    paymentType: string;
    periodType: string;
};

export class SubscriptionRenewalReportDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    private buildSearchConditions(search: SearchSubscriptionRenewalReport) {
        const conditions = [];
        if (search.date) {
            conditions.push(eq(subscriptionRenewalReportTable.date, search.date));
        }
        if (search.productIds) {
            const ids = search.productIds.split(',').filter(Boolean).map(Number).filter(n => !isNaN(n));
            if (ids.length >= 1) {
                conditions.push(inArray(subscriptionRenewalReportTable.productId, ids));
            }
        }
        if (search.paymentChannel) {
            conditions.push(eq(subscriptionRenewalReportTable.paymentChannel, search.paymentChannel));
        }
        if (search.paymentType) {
            conditions.push(eq(subscriptionRenewalReportTable.paymentType, search.paymentType));
        }
        if (search.periodType) {
            conditions.push(eq(subscriptionRenewalReportTable.periodType, search.periodType));
        }

        return conditions;
    }


    async getListPage(page: number, size: number, search: SearchSubscriptionRenewalReport): Promise<{ periodNum: number; subscriptionNum: number }[]> {
        const conditions = this.buildSearchConditions(search);
        const rows = await this.conn.select({
            periodNum: subscriptionRenewalReportTable.periodNum,
            subscriptionNum: sum(subscriptionRenewalReportTable.subscriptionNum),
        })
            .from(subscriptionRenewalReportTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .groupBy(subscriptionRenewalReportTable.periodNum)
            .orderBy(asc(subscriptionRenewalReportTable.periodNum))
            .offset((page - 1) * size)
            .limit(size);
        return rows.map(row => ({
            periodNum: row.periodNum,
            subscriptionNum: Number(row.subscriptionNum) || 0,
        }));
    }

    async getListAtOffset(search: SearchSubscriptionRenewalReport, offset: number): Promise<{ periodNum: number; subscriptionNum: number } | undefined> {
        const conditions = this.buildSearchConditions(search);
        const [row] = await this.conn.select({
            periodNum: subscriptionRenewalReportTable.periodNum,
            subscriptionNum: sum(subscriptionRenewalReportTable.subscriptionNum),
        })
            .from(subscriptionRenewalReportTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .groupBy(subscriptionRenewalReportTable.periodNum)
            .orderBy(asc(subscriptionRenewalReportTable.periodNum))
            .offset(offset)
            .limit(1);
        return row ? { periodNum: row.periodNum, subscriptionNum: Number(row.subscriptionNum) || 0 } : undefined;
    }

    async getListTotal(search: SearchSubscriptionRenewalReport): Promise<number> {
        const conditions = this.buildSearchConditions(search);
        const rows = await this.conn.select({ periodNum: subscriptionRenewalReportTable.periodNum })
            .from(subscriptionRenewalReportTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .groupBy(subscriptionRenewalReportTable.periodNum);
        return rows.length;
    }

    async getReportInfo(condition: GetSubscriptionRenewalReportCondition): Promise<SubscriptionRenewalReportTableSelect> {
        const [result] = await this.conn.select().from(subscriptionRenewalReportTable).where(
            and(
                eq(subscriptionRenewalReportTable.date, condition.date),
                eq(subscriptionRenewalReportTable.productId, condition.productId),
                eq(subscriptionRenewalReportTable.paymentChannel, condition.paymentChannel),
                eq(subscriptionRenewalReportTable.paymentType, condition.paymentType),
                eq(subscriptionRenewalReportTable.periodType, condition.periodType),
                eq(subscriptionRenewalReportTable.periodNum, condition.periodNum)
            )
        );
        return result;
    }

    async addNewReportData(data: SubscriptionRenewalReportTableInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(subscriptionRenewalReportTable).values(data);
    }

    async updateReportDataById(id: number, data: SubscriptionRenewalReportTableInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(subscriptionRenewalReportTable).set(data).where(eq(subscriptionRenewalReportTable.id, id));
    }
}

export const subscriptionRenewalReportDao = new SubscriptionRenewalReportDao();
