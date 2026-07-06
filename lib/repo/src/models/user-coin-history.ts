import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const userCoinHistoryTable = mysqlTable('user_coin_history', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull().default(0),
    collectionId: int('collection_id').notNull().default(0),
    epNum: int('ep_num').notNull().default(0),
    coinNum: int('coin_num').notNull().default(0),
    commType: varchar('comm_type', { length: 10 }).notNull().default(''),
    createTime: int('create_time').notNull().default(0),
    updateTime: int('update_time').notNull().default(0),
});

export type UserCoinHistorySelect = typeof userCoinHistoryTable.$inferSelect;
export type UserCoinHistoryInsert = typeof userCoinHistoryTable.$inferInsert;
