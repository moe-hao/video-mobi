import axios from "axios";
import https from 'https';
import http from 'http';
import { customAlphabet } from 'nanoid';

export type BunnyVideoResult = {
    videoName: string;
    videoType: 'mp4' | 'm3u8';
}

const bunnyVideoFileClient = axios.create({
    httpsAgent: new https.Agent({ keepAlive: true }),
    httpAgent: new http.Agent({ keepAlive: true }),
    validateStatus: (status) => status >= 200 && status < 300,
    timeout: 30 * 60 * 1000,
    headers: { 'AccessKey': 'c9d67fe6-afd5-49e3-976779a46add-e3af-4e2a' }
});

function bunnyVideoName(): string {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return customAlphabet(alphabet, 20)();
}

export async function uploadVideoToBunny(collectionBizId: string, url: string): Promise<BunnyVideoResult> {
    const urlPath = new URL(url).pathname.toLowerCase();
    const isExtNameWithM3U8 = urlPath.endsWith('.m3u8');

    if (isExtNameWithM3U8) {
        const name = await uploadM3U8ToBunny(collectionBizId, url);
        return {
            videoName: name,
            videoType: 'm3u8',
        }
    }
    else {
        const name = await uploadSingleVideoToBunny(collectionBizId, url);
        return {
            videoName: name,
            videoType: 'mp4',
        }
    }
}

async function uploadM3U8ToBunny(collectionBizId: string, url: string): Promise<string> {
    const videoName = `${collectionBizId}-${bunnyVideoName()}`;

    const m3u8Response = await fetch(url, {
        method: 'GET'
    });
    const m3u8Content = await m3u8Response.text();
    const cleanedM3U8 = m3u8Content.replace(/(\.ts)\?[^ \n]*/g, '$1');

    const sourceBaseURL = url.substring(0, url.lastIndexOf('/'));
    const lines = m3u8Content.split('\n');
    const segmentLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('#');
    });

    await bunnyVideoFileClient.put(`https://la.storage.bunnycdn.com/video-storage-001/${videoName}/main.m3u8`, cleanedM3U8);

    const uploadTasks = segmentLines.map(async (line) => {
        const trimmed = line.trim();
        const fileName = trimmed.split('?')[0];
        const fullURL = `${sourceBaseURL}/${trimmed}`;

        const resp = await fetch(fullURL);
        if (resp.ok) {
            const fileData = await resp.arrayBuffer();
            await bunnyVideoFileClient.put(`https://la.storage.bunnycdn.com/video-storage-001/${videoName}/${fileName}`, fileData);
        }
    });
    await Promise.all(uploadTasks);

    return videoName;
}

async function uploadSingleVideoToBunny(collectionBizId: string, url: string): Promise<string> {
    const videoName = `${collectionBizId}-${bunnyVideoName()}`;

    const resp = await fetch(url);
    if (resp.ok) {
        const fileData = await resp.arrayBuffer();
        await bunnyVideoFileClient.put(`https://la.storage.bunnycdn.com/video-storage-001/${videoName}.mp4`, fileData);
    }

    return videoName;
}

