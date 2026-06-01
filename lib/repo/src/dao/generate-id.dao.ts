import { database, type DatabaseConn } from "@lib/internal/database";
import { generateIdTable } from "../models/generate-id";
import { eq, and } from "drizzle-orm";

class GenerateIdDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async generateDailyId(businessName: string): Promise<number> {
        const now = new Date();
        const dateKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const timestamp = Math.floor(Date.now() / 1000);

        return await this.conn.transaction(async (tx) => {
            const [record] = await tx
                .select()
                .from(generateIdTable)
                .where(and(
                    eq(generateIdTable.busniessName, businessName),
                    eq(generateIdTable.key, dateKey),
                ))
                .for("update");

            if (record) {
                const newId = (record.currentId ?? 0) + 1;
                await tx
                    .update(generateIdTable)
                    .set({ currentId: newId, updateTime: timestamp })
                    .where(eq(generateIdTable.id, record.id));
                return newId;
            }

            await tx.insert(generateIdTable).values({
                busniessName: businessName,
                key: dateKey,
                currentId: 1,
                createTime: timestamp,
                updateTime: timestamp,
            });
            return 1;
        });
    }
}

export const generateIdDao = new GenerateIdDao();
