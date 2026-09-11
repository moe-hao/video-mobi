import https from "https";
import type { Readable } from "stream";
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

    uploadVideoStream(guid: string, stream: Readable, contentLength: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: "video.bunnycdn.com",
                path: `/library/${config.BunnyStreamLibrary}/videos/${guid}`,
                method: "PUT",
                headers: {
                    "AccessKey": config.BunnyStreamAccessKey,
                    "Content-Length": contentLength,
                },
            }, (res) => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    res.resume();
                    resolve();
                } else {
                    res.resume();
                    reject(new Error(`Bunny upload failed: ${res.statusCode}`));
                }
            });
            req.on("error", reject);
            stream.pipe(req);
        });
    }
}

export const bunnyStreamProxy = new BunnyStreamProxy();
