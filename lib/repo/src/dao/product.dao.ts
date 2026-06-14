import { count, desc, eq, inArray } from "drizzle-orm";
import { productTable, type ProductInsert, type ProductSelect } from "../models/product";
import { database, type DatabaseConn } from "@lib/internal/database";
import { currentTime } from "@lib/common/utils/time";

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

    async getProductList(): Promise<ProductSelect[]> {
        return await this.conn.select().from(productTable);
    }

    async getProductListInIds(ids: number[]): Promise<ProductSelect[]> {
        const idSet = new Set(ids);
        return await this.conn.select().from(productTable).where(
            inArray(productTable.id, [...idSet.values()])
        );
    }

    async updateProductById(id: number, data: ProductInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(productTable).set(data).where(
            eq(productTable.id, id)
        );
    }

    async addProduct(data: ProductInsert): Promise<void> {
        data.createTime = currentTime();
        data.updateTime = currentTime();
        await this.conn.insert(productTable).values(data);
    }
}

export const productDao = new ProductDao();
