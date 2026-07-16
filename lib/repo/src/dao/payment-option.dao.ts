import { and, count, desc, eq, like, or } from "drizzle-orm";
import { database, type DatabaseConn } from "@lib/internal/database";
import { paymentOptionTable, type PaymentOptionInsert, type PaymentOptionSelect } from "../models/payment-option";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { currentTime } from "@lib/common/utils/time";
import { paymentOptionItemTable } from "../models/payment-option-item";
import type { PaymentOptionContentItemReq } from "@lib/common/dto/payment-option";

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

    async updatePaymentOptionDeleteStatus(id: number, isDeleted: DeleteStatus): Promise<void> {
        await this.conn.update(paymentOptionTable).set({
            isDeleted,
            updateTime: currentTime(),
        }).where(eq(paymentOptionTable.id, id));
    }
}

export const paymentOptionDao = new PaymentOptionDao();

export async function createPaymentOption(name: string, content: PaymentOptionContentItemReq[]): Promise<void> {
    const nowTime = currentTime();
    await database.transaction(async (tx) => {
        const [result] = await tx.insert(paymentOptionTable).values({
            name: name,
            createTime: nowTime,
            updateTime: nowTime,
        });

        if (content && content.length > 0) {
            const items = content.map((item) => ({
                paymentOptionId: result.insertId,
                paymentType: item.paymentType,
                paymentChannel: item.paymentChannel,
                createTime: nowTime,
                updateTime: nowTime,
            }));
            await tx.insert(paymentOptionItemTable).values(items);
        }
    });
}

export async function updatePaymentOptionById(id: number, name: string, content: PaymentOptionContentItemReq[]): Promise<void> {
    const nowTime = currentTime();
    await database.transaction(async (tx) => {
        await tx.update(paymentOptionTable).set({
            name: name,
            updateTime: nowTime,
        }).where(eq(paymentOptionTable.id, id));

        await tx.update(paymentOptionItemTable).set({ isDeleted: DeleteStatus.Deleted, updateTime: nowTime }).where(eq(paymentOptionItemTable.paymentOptionId, id));

        if (content && content.length > 0) {
            const items = content.map((item) => ({
                paymentOptionId: id,
                paymentType: item.paymentType,
                paymentChannel: item.paymentChannel,
                createTime: nowTime,
                updateTime: nowTime,
            }));
            await tx.insert(paymentOptionItemTable).values(items);
        }
    });
}
