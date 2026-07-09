import { type SubscriptionInsert, type SubscriptionSelect, subscriptionTable } from "../models/subscription";
import { and, count, desc, eq, gte, lte, or } from "drizzle-orm";
import { database, type DatabaseConn } from "@lib/internal/database";
import { currentTime } from "@lib/common/utils/time";
import { SubscriptionStatus } from "@lib/common/consts/subscription";
import type { PaymentChannel } from "@lib/common/consts/payment";

export type SubscriptionSearchReq = {
    status: SubscriptionStatus | string;
    subscriptionNo: string;
    startDate: string;
    endDate: string;
}

export class SubscriptionDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    private buildSearchConditions(search: SubscriptionSearchReq) {
        const conditions = [];
        if (search.subscriptionNo) {
            const searchConditions = [];
            if (!isNaN(Number(search.subscriptionNo))) {
                searchConditions.push(eq(subscriptionTable.id, Number(search.subscriptionNo)));
            }
            searchConditions.push(eq(subscriptionTable.subscriptionNo, search.subscriptionNo));
            conditions.push(or(...searchConditions));
        }
        if (search.status) {
            conditions.push(eq(subscriptionTable.subscriptionStatus, Number(search.status)));
        }
        if (search.startDate && search.endDate) {
            conditions.push(and(
                gte(subscriptionTable.createTime, Number(search.startDate)),
                lte(subscriptionTable.createTime, Number(search.endDate)),
            ));
        }
        return conditions;
    }

    async getSubscriptionPageList(page: number, size: number, search: SubscriptionSearchReq): Promise<SubscriptionSelect[]> {
        const conditions = this.buildSearchConditions(search);
        return await this.conn.select().from(subscriptionTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .limit(size).offset((page - 1) * size).orderBy(desc(subscriptionTable.id));
    }

    async getSubscriptionPageTotal(search: SubscriptionSearchReq): Promise<number> {
        const conditions = this.buildSearchConditions(search);
        const [result] = await this.conn.select({ count: count() }).from(subscriptionTable)
            .where(conditions.length ? and(...conditions) : undefined);
        return result.count;
    }

    async getSubscriptionById(id: number): Promise<SubscriptionSelect> {
        const [subscription] = await this.conn.select().from(subscriptionTable).where(eq(subscriptionTable.id, id));
        return subscription;
    }

    async addSubscription(data: SubscriptionInsert): Promise<number> {
        data.createTime = currentTime()
        data.updateTime = currentTime()
        const [result] = await this.conn.insert(subscriptionTable).values(data);
        return result.insertId;
    }

    async getSubscriptionByNo(subscriptionNo: string): Promise<SubscriptionSelect> {
        const [subscription] = await this.conn.select().from(subscriptionTable).where(
            eq(subscriptionTable.subscriptionNo, subscriptionNo)
        );
        return subscription;
    }

    async getSubscriptionActiveByUserId(userId: number): Promise<SubscriptionSelect> {
        const [subscription] = await this.conn.select().from(subscriptionTable).where(and(
            eq(subscriptionTable.userId, userId),
            eq(subscriptionTable.subscriptionStatus, SubscriptionStatus.Active)
        ));
        return subscription;
    }

    async getSubscriptionListByUserId(userId: number): Promise<SubscriptionSelect[]> {
        return await this.conn.select().from(subscriptionTable).where(eq(subscriptionTable.userId, userId));
    }

    async getSubscriptionListByChannelAndStatus(channel: PaymentChannel, status: SubscriptionStatus): Promise<SubscriptionSelect[]> {
        return await this.conn.select().from(subscriptionTable).where(
            and(
                eq(subscriptionTable.subscriptionChannel, channel),
                eq(subscriptionTable.subscriptionStatus, status)
            )
        );
    }

    async updateSubscriptionById(id: number, data: SubscriptionInsert): Promise<void> {
        data.updateTime = currentTime()
        await this.conn.update(subscriptionTable).set(data).where(eq(subscriptionTable.id, id));
    }

    async updateSubscriptionByNo(subscriptionNo: string, data: SubscriptionInsert): Promise<void> {
        data.updateTime = currentTime()
        await this.conn.update(subscriptionTable).set(data).where(eq(subscriptionTable.subscriptionNo, subscriptionNo));
    }
}

export const subscriptionDao = new SubscriptionDao();
