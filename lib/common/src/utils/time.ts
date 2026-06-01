export function currentTime(): number {
    return Math.floor(Date.now() / 1000);
}

export function formatUnixTime(time: number = currentTime()) {
    return new Date(time * 1000).toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
}
