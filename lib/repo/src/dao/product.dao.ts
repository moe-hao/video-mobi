import { count, desc, eq } from "drizzle-orm";
import { productTable, type ProductSelect } from "../models/product";
import { database, type DatabaseConn } from "@lib/internal/database";

class ProductDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getProductByHost(host: string): Promise<ProductSelect> {
        const [result] = await this.conn.select().from(productTable).where(
            eq(productTable.host, host)
        );
        return result;
    }

    async getProductPage(page: number, size: number): Promise<ProductSelect[]> {
        return await this.conn.select().from(productTable).orderBy(desc(productTable.id)).offset((page - 1) * size).limit(size);
    }

    async getProductCount(): Promise<number> {
        const [result] = await this.conn.select({ count: count() }).from(productTable);
        return result.count;
    }
}

export const productDao = new ProductDao();
