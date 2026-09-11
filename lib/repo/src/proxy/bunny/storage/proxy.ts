import { Readable } from "node:stream";
import { client } from "./client";

class BunnyVideoStorageProxy {
    async upload(path: string, name: string, data: ReadableStream) {
        // 将Web ReadableStream转换为Node.js Readable流，实现流式上传
        const nodeStream = Readable.fromWeb(data as any);
        await client.put(`${path}/${name}`, nodeStream, {
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });
    }
}

export const bunnyVideoStorageProxy = new BunnyVideoStorageProxy();

