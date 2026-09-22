import { formatDate } from "date-fns";
import pino from "pino";

export const logger = pino({
    timestamp: () => `,"time":"${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')}"`,
    base: undefined,
    formatters: {
        level(label) {
            return { level: label };
        },
    },
});
