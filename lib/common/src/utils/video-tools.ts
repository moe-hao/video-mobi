export class BunnyVideoStorage {
    constructor(
        private readonly baseURL: string = '',
        private readonly zoneName: string = '',
        private readonly accessKey: string = '',
    ) { }

    async uploadByURL(url: string, name: string) {
        const resource = await fetch(url);
        const contentType = resource.headers.get("content-type") || '';

        if (url.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('m3u8')) {
            await this.uploadM3U8(url, resource, name);
        } else {
            await this.uploadVideo(resource, name);
        }
    }

    private async uploadVideo(resource: Response, name: string): Promise<number> {
        const data = await resource.bytes();
        return await this.upload(data, name);
    }

    private async uploadM3U8(url: string, resource: Response, baseName: string) {
        const main = await resource.text();
        const data = main.replace(/(\d+\.ts)\?[^ \n]*/g, '$1');
        await this.upload(data, `${baseName}/main.m3u8`);

        const sourceBaseURL = url.split('/main.m3u8')[0];

        const lines = main.split('\n');
        const tasks = lines.filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('#');
        }).map(async line => {
            const trimmed = line.trim();
            const fileName = trimmed.split('?')[0];
            const fullURL = `${sourceBaseURL}/${trimmed}`;

            const resp = await fetch(fullURL);
            if (resp.ok) {
                const fileData = await resp.bytes();
                await this.upload(fileData, `${baseName}/${fileName}`);
                console.log('upload ts', `${baseName}/${fileName}`);
            }
        });
        await Promise.all(tasks);
    }

    private async upload(data: any, name: string): Promise<number> {
        const resp = await fetch(`${this.baseURL}/${this.zoneName}/${name}`, {
            method: 'PUT',
            headers: {
                'AccessKey': this.accessKey,
                'Content-Type': 'application/octet-stream'
            },
            body: data,
        });
        return resp.status;
    }
}


export const bunnyVideoStorage = new BunnyVideoStorage();




