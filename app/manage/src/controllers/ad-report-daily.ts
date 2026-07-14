import { Hono } from "hono";
import { adReportDailyService } from "../services/ad-report-daily.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { adReportDailyListReqSchema, adReportDailySummaryReqSchema } from "@lib/common/dto/ad-report-daily";

const adReportDaily = new Hono();

adReportDaily.get('/daily_list', validated('query', adReportDailyListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailyList(req);
    return c.json(success(resp));
});

adReportDaily.get('/daily_summary', validated('query', adReportDailySummaryReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailySummary(req.date);
    return c.json(success(resp));
});

export default adReportDaily;
