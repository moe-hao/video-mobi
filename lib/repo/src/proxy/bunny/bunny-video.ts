import config from "@lib/internal/config";
import type { FetchVideoResult } from "./bunny.dto";

export class BunnyVideoProxy {
    constructor(
        private readonly videoBaseURL: string = 'https://video.bunnycdn.com',
        private readonly accessKey: string = config.BunnyApiAccessKey,
        private readonly libraryId: string = config.BunnyVideoLibraryId,
    ) { }

    async uploadVideoByURL(url: string, fileName: string): Promise<string> {
        const uploadURL = `${this.videoBaseURL}/${this.libraryId}/videos/fetch`;
        const resp = await fetch(uploadURL, {
            method: 'POST',
            headers: {
                'AccessKey': this.accessKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                title: fileName,
            }),
        });

        const result = await resp.json() as FetchVideoResult;
        return result.id;
    }
}
