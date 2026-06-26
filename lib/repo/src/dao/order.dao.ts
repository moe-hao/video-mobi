
import { database, type DatabaseConn } from "@lib/internal/database";
import { orderTable, type OrderInsert, type OrderSelect } from "../models/order";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";
import { PaymentChannel } from "@lib/common/consts/payment";
import { OrderStatus } from "@lib/common/consts/order";

class OrderDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getOrderListPage(page: number, size: number): Promise<OrderSelect[]> {
        return await this.conn.select().from(orderTable).orderBy(desc(orderTable.id)).offset((page - 1) * size).limit(size);
    }

    async getOrderListTotal(): Promise<number> {
        const [result] = await this.conn.select({ count: count() }).from(orderTable);
        return result.count;
    }

    async getOrderById(id: number): Promise<OrderSelect> {
        const [order] = await this.conn.select().from(orderTable).where(
            eq(orderTable.id, id)
        );
        return order;
    }

    async getOrderByBizId(bizId: string): Promise<OrderSelect> {
        const [order] = await this.conn.select().from(orderTable).where(
            eq(orderTable.bizId, bizId)
        );
        return order;
    }

    async getOrderListByUserIdAndSubscriptionId(userId: number, subscriptionId: number): Promise<OrderSelect[]> {
        return await this.conn.select().from(orderTable).where(
            and(
                eq(orderTable.userId, userId),
                eq(orderTable.subscriptionId, subscriptionId),
            )
        ).orderBy(desc(orderTable.id));
    }

    async getOrderByPaymentIdAndChannel(paymentId: string, channel: PaymentChannel): Promise<OrderSelect> {
        const [order] = await this.conn.select().from(orderTable).where(
            and(
                eq(orderTable.paymentId, paymentId),
                eq(orderTable.paymentChannel, channel)
            )
        );
        return order;
    }

    async getOrderCountBySubscriptionId(subscriptionId: number): Promise<number> {
        const [result] = await this.conn.select({ count: count() }).from(orderTable).where(
            and(
                eq(orderTable.subscriptionId, subscriptionId),
                inArray(orderTable.orderStatus, [OrderStatus.Paid, OrderStatus.Completed])
            )
        );
        return result.count;
    }

    async updateOrderById(id: number, data: OrderInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(orderTable).set(data).where(
            eq(orderTable.id, id)
        );
    }

    async updateOrderByBizId(bizId: string, data: OrderInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(orderTable).set(data).where(
            eq(orderTable.bizId, bizId)
        );
    }

    async updateOrderByPaymentId(paymentId: string, data: OrderInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(orderTable).set(data).where(
            eq(orderTable.paymentId, paymentId)
        );
    }

    async addOrder(data: OrderInsert): Promise<number> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        const [result] = await this.conn.insert(orderTable).values(data);
        return result.insertId;
    }
}

export const orderDao = new OrderDao();
