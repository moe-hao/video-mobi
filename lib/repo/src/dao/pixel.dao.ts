import { database, type DatabaseConn } from "@lib/internal/database";
import { pixelTable, type PixelSelect } from "../models/pixel";
import { eq } from "drizzle-orm";

class PixelDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getPixelById(id: number): Promise<PixelSelect> {
        const [result] = await this.conn.select().from(pixelTable).where(
            eq(pixelTable.id, id)
        );
        return result;
    }
}

export const pixelDao = new PixelDao();
