import { useCallback, useState } from "react";
import type { AdReportDailyGroupReq, AdReportDailyGroupResp } from "@lib/common/dto/ad-report-daily";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useAdReportDailyGroupState(): {
  adReportDailyGroupState: AdReportDailyGroupResp;
  fetchAdReportDailyGroup: (req: AdReportDailyGroupReq) => Promise<AdReportDailyGroupResp>;
} {
  const [adReportDailyGroupState, setAdReportDailyGroupState] = useState<AdReportDailyGroupResp>({} as AdReportDailyGroupResp);
  const fetchAdReportDailyGroup = useCallback(async (req: AdReportDailyGroupReq) => {
    const resp = await http.get<AdReportDailyGroupResp>(`/api/report/daily_group?${convertURLSearchParams(req)}`);
    setAdReportDailyGroupState(resp.data);
    return resp.data;
  }, []);

  return {
    adReportDailyGroupState,
    fetchAdReportDailyGroup,
  }
}
