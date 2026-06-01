import { database, type DatabaseConn } from "@lib/internal/database";
import { memberTable, type MemberInsert, type MemberSelect } from "../models/member";
import { eq, inArray } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

class MemberDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getMemberListByUserIds(userIds: number[]): Promise<MemberSelect[]> {
        const result = await this.conn.select().from(memberTable).where(
            inArray(memberTable.userId, userIds)
        )
        return result;
    }

    async getMemberByUserId(userId: number): Promise<MemberSelect> {
        const [member] = await this.conn.select().from(memberTable).where(
            eq(memberTable.userId, userId)
        );
        return member;
    }

    async updateMemberById(id: number, data: MemberInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(memberTable).set(data).where(
            eq(memberTable.id, id)
        );
    }

    async updateMemberByUserId(userId: number, data: MemberInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(memberTable).set(data).where(
            eq(memberTable.userId, userId)
        );
    }

    async addMember(data: MemberInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(memberTable).values(data);
    }
}

export const memberDao = new MemberDao();
