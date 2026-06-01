type VideoAuthResp = {
    msg: string;
    code: number;
    token: string;
}

export async function getVideoAuth(): Promise<string> {
    const resp = await fetch('https://br1.beeshortframe.com/shorts/user/loginByDevice', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
            user: {
                deviceId: '19d86f0be3f1548-0f85487c06f916-57216b25-3686400-19d86f0be401c37',
                product: 'beesShort',
                source: '',
                lang: 'pt'
            }
        })
    })
    const data = await resp.json() as VideoAuthResp;
    return data.token;
}

type VideoListResp = {
    msg: string;
    code: number;
    data: {
        num: number;
        playUrl: string;
        coverImage: string;
    }[];
}

export async function getVideoList(videoAuth: string, videoId: number, episodes: number): Promise<{ num: number, playUrl: string, coverImage: string }[]> {
    const resp = await fetch(`https://br1.beeshortframe.com/shorts/volc/playUrlList/${videoId}/0/${episodes}`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${videoAuth}`
        }
    })
    const data = await resp.json() as VideoListResp;
    return data.data;
}
