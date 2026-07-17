import { and, count, desc, eq, like, or } from "drizzle-orm";
import { database, type DatabaseConn } from "@lib/internal/database";
import { paymentOptionTable, type PaymentOptionInsert, type PaymentOptionSelect } from "../models/payment-option";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { currentTime } from "@lib/common/utils/time";

export class PaymentOptionDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    private buildSearchConditions(search: string) {
        const conditions = [];
        if (search) {
            const searchConditions = [];
            if (!isNaN(Number(search))) {
                searchConditions.push(eq(paymentOptionTable.id, Number(search)));
            }
            searchConditions.push(like(paymentOptionTable.name, `%${search}%`));
            conditions.push(or(...searchConditions)!);
        }
        conditions.push(eq(paymentOptionTable.isDeleted, DeleteStatus.NotDeleted));
        return conditions;
    }

    async getPaymentOptionPageList(page: number, size: number, search: string): Promise<PaymentOptionSelect[]> {
        const conditions = this.buildSearchConditions(search);
        return await this.conn.select().from(paymentOptionTable)
            .where(and(...conditions))
            .orderBy(desc(paymentOptionTable.id))
            .offset((page - 1) * size)
            .limit(size);
    }

    async getPaymentOptionTotal(search: string): Promise<number> {
        const conditions = this.buildSearchConditions(search);
        const [result] = await this.conn.select({ count: count() }).from(paymentOptionTable)
            .where(and(...conditions));
        return result.count;
    }

    async getPaymentOptionTableList(): Promise<PaymentOptionSelect[]> {
        return await this.conn.select().from(paymentOptionTable);
    }

    async updatePaymentOptionById(id: number, data: PaymentOptionInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(paymentOptionTable).set(data).where(eq(paymentOptionTable.id, id));
    }

    async addPaymentOption(name: string): Promise<number> {
        const nowTime = currentTime();
        const [result] = await this.conn.insert(paymentOptionTable).values({
            name: name,
            createTime: nowTime,
            updateTime: nowTime,
        });
        return result.insertId;
    }
}

export const paymentOptionDao = new PaymentOptionDao();
