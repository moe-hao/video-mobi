import { useCallback, useState } from "react";
import type { AdReportDailySummaryReq, AdReportDailySummaryResp } from "@lib/common/dto/ad-report-daily";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useAdReportDailySummaryState(): {
  adReportDailySummaryState: AdReportDailySummaryResp;
  fetchAdReportDailySummary: (req: AdReportDailySummaryReq) => Promise<AdReportDailySummaryResp>;
} {
  const [adReportDailySummaryState, setAdReportDailySummaryState] = useState<AdReportDailySummaryResp>({} as AdReportDailySummaryResp);
  const fetchAdReportDailySummary = useCallback(async (req: AdReportDailySummaryReq) => {
    const resp = await http.get<AdReportDailySummaryResp>(`/api/report/daily_summary?${convertURLSearchParams(req)}`);
    setAdReportDailySummaryState(resp.data);
    return resp.data;
  }, []);

  return {
    adReportDailySummaryState,
    fetchAdReportDailySummary,
  }
}
