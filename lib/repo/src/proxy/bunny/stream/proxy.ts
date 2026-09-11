import { client } from "./client";
import config from "@lib/internal/config";

export class BunnyStreamProxy {
    async createVideo(title: string): Promise<string> {
        const result = await client.post<{ guid: string }>("/videos", { title: title });
        return result.data.guid;
    }

    async uploadVideo(guid: string, file: File) {
        await client.put(`/videos/${guid}`, file);
    }

    async uploadVideoProxy(guid: string, body: ReadableStream | null, contentLength: string): Promise<void> {
        const resp = await fetch(`https://video.bunnycdn.com/library/${config.BunnyStreamLibrary}/videos/${guid}`, {
            method: "PUT",
            headers: {
                "AccessKey": config.BunnyStreamAccessKey,
                "Content-Length": contentLength,
            },
            body,
            duplex: "half",
        } as RequestInit);

        if (!resp.ok) {
            throw new Error(`Bunny upload failed: ${resp.status}`);
        }
    }
}

export const bunnyStreamProxy = new BunnyStreamProxy();
