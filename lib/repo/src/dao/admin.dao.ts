import { eq } from "drizzle-orm";
import { adminTable, type AdminSelect } from "../models/admin";
import { database, type DatabaseConn } from "@lib/internal/database";
import { currentTime } from "@lib/common/utils/time";

class AdminDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getAdminInfoByUsername(username: string): Promise<AdminSelect> {
        const [result] = await this.conn.select().from(adminTable).where(
            eq(adminTable.username, username)
        );
        return result;
    }

    async getAdminInfoById(id: number): Promise<AdminSelect> {
        const [result] = await this.conn.select().from(adminTable).where(
            eq(adminTable.id, id)
        );
        return result;
    }

    async updateAdminPasswordById(id: number, password: string) {
        await this.conn.update(adminTable).set({ password: password, updateTime: currentTime() }).where(eq(adminTable.id, id));
    }
}

export const adminDao = new AdminDao();
