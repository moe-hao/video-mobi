import { database, type DatabaseConn } from "@lib/internal/database";
import { feedbackTable, type FeedbackInsert } from "../models/feedback";

class FeedbackDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async addFeedback(data: FeedbackInsert) {
        await this.conn.insert(feedbackTable).values(data);
    }
}

export const feedbackDao = new FeedbackDao();
