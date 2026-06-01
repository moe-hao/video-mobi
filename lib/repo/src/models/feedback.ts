import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const feedbackTable = mysqlTable("feedback", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().default(0),
    email: varchar("email", { length: 256 }).notNull().default(''),
    feedbackType: varchar("feedback_type", { length: 64 }).notNull().default(''),
    feedbackBusinessId: varchar("feedback_business_id", { length: 256 }).notNull().default(''),
    description: varchar("description", { length: 512 }).notNull().default(''),
    createTime: int("create_time").notNull().default(0),
    updateTime: int("update_time").notNull().default(0),
})

export type FeedbackSelect = typeof feedbackTable.$inferSelect;
export type FeedbackInsert = typeof feedbackTable.$inferInsert;
