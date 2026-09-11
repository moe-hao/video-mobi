import { client } from "./client";

export class BunnyStreamProxy {
    async createVideo(title: string): Promise<string> {
        const result = await client.post<{ guid: string }>("/videos", { title: title });
        return result.data.guid;
    }

    async uploadVideo(guid: string, file: File) {
        await client.put(`/videos/${guid}`, file);
    }
}

export const bunnyStreamProxy = new BunnyStreamProxy();
