import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { AdReportDailyListReq, AdReportDailyListResp } from "@lib/common/dto/ad-report-daily";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useAdReportDailyListState(): {
  adReportDailyListState: AdReportDailyListResp;
  fetchAdReportDailyList: (req: AdReportDailyListReq) => Promise<AdReportDailyListResp>;
} {
  const [adReportDailyListState, setAdReportDailyListState] = useState<AdReportDailyListResp>({} as AdReportDailyListResp);
  const fetchAdReportDailyList = useCallback(async (req: AdReportDailyListReq) => {
    const result = await request<AdReportDailyListResp>(`/api/report/daily_list?${convertURLSearchParams(req)}`, 'GET');
    setAdReportDailyListState(result);
    return result;
  }, []);

  return {
    adReportDailyListState,
    fetchAdReportDailyList,
  }
}
