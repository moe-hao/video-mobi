import { useCallback, useState } from "react";
import type { AdReportDailyListReq, AdReportDailyListResp } from "@lib/common/dto/ad-report-daily";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useAdReportDailyListState(): {
  adReportDailyListState: AdReportDailyListResp;
  fetchAdReportDailyList: (req: AdReportDailyListReq) => Promise<AdReportDailyListResp>;
} {
  const [adReportDailyListState, setAdReportDailyListState] = useState<AdReportDailyListResp>({} as AdReportDailyListResp);
  const fetchAdReportDailyList = useCallback(async (req: AdReportDailyListReq) => {
    const resp = await http.get<AdReportDailyListResp>(`/api/report/daily_list?${convertURLSearchParams(req)}`);
    setAdReportDailyListState(resp.data);
    return resp.data;
  }, []);

  return {
    adReportDailyListState,
    fetchAdReportDailyList,
  }
}
