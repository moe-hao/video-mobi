import { database, type DatabaseConn } from "@lib/internal/database";
import { subscriptionRenewalReportTable, type SubscriptionRenewalReportTableInsert, type SubscriptionRenewalReportTableSelect } from "../models/subscription-renewal-report";
import type { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { and, eq } from "drizzle-orm";
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

export class SubscriptionRenewalReportDao {
    constructor(private readonly conn: DatabaseConn = database) { }

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
