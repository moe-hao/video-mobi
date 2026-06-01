import pino from "pino";

function formatUnixTime() {
    return new Date().toLocaleString('zh-CN', {
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

export const logger = pino({
    timestamp: () => `,"time":"${formatUnixTime()}"`,
    base: undefined,
    formatters: {
        level(label) {
            return { level: label };
        },
    },
});
