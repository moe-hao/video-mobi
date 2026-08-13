import { database, type DatabaseConn } from "@lib/internal/database";
import { subscriptionRenewalReportTable, type SubscriptionRenewalReportTableInsert, type SubscriptionRenewalReportTableSelect } from "../models/subscription-renewal-report";
import type { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { and, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

export class SubscriptionRenewalReportDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getReportInfo(date: string, productId: number, paymentChannel: PaymentChannel, paymentType: PaymentType, periodNum: number): Promise<SubscriptionRenewalReportTableSelect> {
        const [result] = await this.conn.select().from(subscriptionRenewalReportTable).where(
            and(
                eq(subscriptionRenewalReportTable.date, date),
                eq(subscriptionRenewalReportTable.productId, productId),
                eq(subscriptionRenewalReportTable.paymentChannel, paymentChannel),
                eq(subscriptionRenewalReportTable.paymentType, paymentType),
                eq(subscriptionRenewalReportTable.periodNum, periodNum)
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
