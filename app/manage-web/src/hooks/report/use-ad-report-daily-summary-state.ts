import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { AdReportDailySummaryReq, AdReportDailySummaryResp } from "@lib/common/dto/ad-report-daily";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useAdReportDailySummaryState(): {
  adReportDailySummaryState: AdReportDailySummaryResp;
  fetchAdReportDailySummary: (req: AdReportDailySummaryReq) => Promise<AdReportDailySummaryResp>;
} {
  const [adReportDailySummaryState, setAdReportDailySummaryState] = useState<AdReportDailySummaryResp>({} as AdReportDailySummaryResp);
  const fetchAdReportDailySummary = useCallback(async (req: AdReportDailySummaryReq) => {
    const result = await request<AdReportDailySummaryResp>(`/api/report/daily_summary?${convertURLSearchParams(req)}`, 'GET');
    setAdReportDailySummaryState(result);
    return result;
  }, []);

  return {
    adReportDailySummaryState,
    fetchAdReportDailySummary,
  }
}
