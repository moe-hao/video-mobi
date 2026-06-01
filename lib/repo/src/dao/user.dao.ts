import { database, type DatabaseConn } from "@lib/internal/database";
import { userTable, type UserInsert, type UserSelect } from "../models/user";
import { and, count, desc, eq, inArray, or } from "drizzle-orm";
import { DeleteStatus } from "@lib/common/consts/common-status";
import { currentTime } from "@lib/common/utils/time";

class UserDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getUserInfoByEmail(email: string): Promise<UserSelect> {
        const [user] = await this.conn.select().from(userTable).where(eq(userTable.email, email));
        return user;
    }

    async getUserListSearch(page: number, size: number, search: string): Promise<UserSelect[]> {
        const conditions = [];
        if (search) {
            const searchConditions = [
                eq(userTable.bizId, search),
                eq(userTable.username, search),
                eq(userTable.email, search),
            ];
            if (!isNaN(Number(search))) {
                searchConditions.unshift(eq(userTable.id, Number(search)));
            }
            conditions.push(or(...searchConditions))
        }
        conditions.push(eq(userTable.isDeleted, DeleteStatus.NotDeleted));
        const list = await this.conn.select().from(userTable).where(and(...conditions)).orderBy(desc(userTable.id)).offset((page - 1) * size).limit(size);
        return list;
    }

    async getUserTotalSearch(search: string): Promise<number> {
        const conditions = [];
        if (search) {
            const searchConditions = [
                eq(userTable.bizId, search),
                eq(userTable.username, search),
                eq(userTable.email, search),
            ];
            if (!isNaN(Number(search))) {
                searchConditions.unshift(eq(userTable.id, Number(search)));
            }
            conditions.push(or(...searchConditions))
        }
        conditions.push(eq(userTable.isDeleted, DeleteStatus.NotDeleted));

        const [result] = await this.conn.select({ count: count() }).from(userTable).where(and(...conditions));
        return result.count;
    }

    async getUserInfoById(id: number): Promise<UserSelect> {
        const [user] = await this.conn.select().from(userTable).where(eq(userTable.id, id));
        return user;
    }

    async getUserListByIds(ids: number[]): Promise<UserSelect[]> {
        return await this.conn.select().from(userTable).where(
            inArray(userTable.id, ids)
        );
    }

    async getUserInfoByBizId(bizId: string): Promise<UserSelect> {
        const [user] = await this.conn.select().from(userTable).where(eq(userTable.bizId, bizId));
        return user;
    }

    async getUserInfoByAuthToken(authToken: string): Promise<UserSelect> {
        const [user] = await this.conn.select().from(userTable).where(eq(userTable.authToken, authToken));
        return user;
    }

    async updateUserInfoById(id: number, data: UserInsert): Promise<void> {
        await this.conn.update(userTable).set(data).where(eq(userTable.id, id));
    }

    async addUser(data: UserInsert): Promise<number> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        const [result] = await this.conn.insert(userTable).values(data);
        return result.insertId;
    }
}

export const userDao = new UserDao();
