import { database, type DatabaseConn } from "@lib/internal/database";
import { paymentOptionItemTable, type PaymentOptionItemInsert } from "../models/payment-option-item";
import { and, eq } from "drizzle-orm";
import { DeleteStatus } from "@lib/common/consts/common-status";

class PaymentOptionItemDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async addPaymentOptionItem(items: PaymentOptionItemInsert[]): Promise<void> {
        await this.conn.insert(paymentOptionItemTable).values(items);
    }

    async updatePaymentOptionItemByPaymentOptionId(paymentOptionId: number, data: PaymentOptionItemInsert): Promise<void> {
        await this.conn.update(paymentOptionItemTable).set(data).where(eq(paymentOptionItemTable.paymentOptionId, paymentOptionId));
    }

    async getPaymentOptionItemsByOptionId(paymentOptionId: number) {
        return await this.conn.select().from(paymentOptionItemTable)
            .where(and(
                eq(paymentOptionItemTable.paymentOptionId, paymentOptionId),
                eq(paymentOptionItemTable.isDeleted, DeleteStatus.NotDeleted),
            ))
            .orderBy(paymentOptionItemTable.sort);
    }
}

export const paymentOptionItemDao = new PaymentOptionItemDao();
