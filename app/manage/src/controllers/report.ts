import { Hono } from "hono";
import { adReportDailyService } from "../services/ad-report-daily.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { adReportDailyListReqSchema, adReportDailySummaryReqSchema } from "@lib/common/dto/ad-report-daily";
import { subscriptionRenewalReportListReqSchema } from "@lib/common/dto/subscription-renewal-report";
import { getSubscriptionRenewalReportList } from "../services/subscription-renewal-report.service";
import { ltvReportListReqSchema } from "@lib/common/dto/ltv-report";
import { getLtvReportList } from "../services/ltv.service";

const report = new Hono();

report.get('/daily_list', validated('query', adReportDailyListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailyList(req);
    return c.json(success(resp));
});

report.get('/daily_summary', validated('query', adReportDailySummaryReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailySummary(req.date, req.platform);
    return c.json(success(resp));
});

report.get('/subscription_renewal', validated('query', subscriptionRenewalReportListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await getSubscriptionRenewalReportList(req);
    return c.json(success(resp));
});

report.get('/ltv', validated('query', ltvReportListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await getLtvReportList(req);
    return c.json(success(resp));
});

export default report;
