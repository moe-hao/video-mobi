import { Hono } from "hono";
import { adReportDailyService } from "../services/ad-report-daily.service";
import { validated } from "@lib/middleware/validated";
import { success } from "@lib/common/dto/result";
import { AdReportDailyListReqSchema, AdReportDailySummaryReqSchema, AdReportDailyGroupReqSchema } from "@lib/common/dto/ad-report-daily.schema";
import { SubscriptionRenewalReportListReqSchema } from "@lib/common/dto/subscription-renewal-report.schema";
import { getSubscriptionRenewalReportList } from "../services/subscription-renewal-report.service";
import { LtvReportListReqSchema } from "@lib/common/dto/ltv-report.schema";
import { getLtvReportList } from "../services/ltv.service";

const report = new Hono();

report.get('/daily_list', validated('query', AdReportDailyListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailyList(req);
    return c.json(success(resp));
});

report.get('/daily_summary', validated('query', AdReportDailySummaryReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailySummary(req.date, req.platform);
    return c.json(success(resp));
});

report.get('/subscription_renewal', validated('query', SubscriptionRenewalReportListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await getSubscriptionRenewalReportList(req);
    return c.json(success(resp));
});

report.get('/ltv', validated('query', LtvReportListReqSchema), async (c) => {
    const req = c.req.valid('query');
    const resp = await getLtvReportList(req);
    return c.json(success(resp));
});

report.get('/daily_group', validated('query', AdReportDailyGroupReqSchema), async (c) => {
    const search = c.req.valid('query');
    const resp = await adReportDailyService.getAdReportDailyGroup(search);
    return c.json(success(resp));
});

export default report;
