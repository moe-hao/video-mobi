import { database, type DatabaseConn } from "@lib/internal/database";
import { videoTable, type VideoInsert, type VideoSelect } from "../models/video";
import { and, asc, count, eq } from "drizzle-orm";
import { currentTime } from "@lib/common/utils/time";

class VideoDao {
    constructor(private readonly conn: DatabaseConn = database) { }

    async getCollectionVideoPage(page: number, size: number, collectionId: number): Promise<VideoSelect[]> {
        return await this.conn.select().from(videoTable).where(
            eq(videoTable.collectionId, collectionId)
        ).orderBy(asc(videoTable.epNum)).offset((page - 1) * size).limit(size);
    }

    async getCollectionVideoCount(collectionId: number): Promise<number> {
        const [result] = await this.conn.select({ count: count() }).from(videoTable).where(
            eq(videoTable.collectionId, collectionId)
        );
        return result.count;
    }

    async getVideoByCollectionIdAndEpNum(collectionId: number, epNum: number): Promise<VideoSelect> {
        const [result] = await this.conn.select().from(videoTable).where(
            and(eq(videoTable.collectionId, collectionId), eq(videoTable.epNum, epNum))
        );
        return result;
    }

    async getVideoByCollectionId(collectionId: number): Promise<VideoSelect[]> {
        return await this.conn.select().from(videoTable).where(
            eq(videoTable.collectionId, collectionId)
        );
    }

    async getVideoById(id: number): Promise<VideoSelect> {
        const [result] = await this.conn.select().from(videoTable).where(
            eq(videoTable.id, id)
        );
        return result;
    }

    async addVideo(data: VideoInsert): Promise<void> {
        await this.conn.insert(videoTable).values(data);
    }

    async updateVideoByCollectionIdAndEpNum(collectionId: number, epNum: number, data: VideoInsert): Promise<void> {
        data.updateTime = currentTime();
        await this.conn.update(videoTable).set(data).where(
            and(eq(videoTable.collectionId, collectionId), eq(videoTable.epNum, epNum))
        );
    }
}

export const videoDao = new VideoDao();
