import { database, type DatabaseConn } from "@lib/internal/database";
import { skuTable, type SkuSelect } from "../models/sku";
import { desc, eq } from "drizzle-orm";

class SkuDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getSkuById(id: number): Promise<SkuSelect> {
        const [result] = await this.conn.select().from(skuTable).where(
            eq(skuTable.id, id)
        );
        return result;
    }

    async getSkuByBizId(bizId: string): Promise<SkuSelect> {
        const [result] = await this.conn.select().from(skuTable).where(
            eq(skuTable.bizId, bizId)
        );
        return result;
    }

    async getSkuListByProductId(productId: number): Promise<SkuSelect[]> {
        return await this.conn.select().from(skuTable).where(
            eq(skuTable.productId, productId)
        ).orderBy(desc(skuTable.weight));
    }
}

export const skuDao = new SkuDao();
