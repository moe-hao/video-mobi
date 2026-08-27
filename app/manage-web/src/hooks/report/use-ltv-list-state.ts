import { useCallback, useState } from "react";
import type { LtvReportListReq, LtvReportListResp } from "@lib/common/dto/ltv-report";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useLtvListState(): {
  ltvListState: LtvReportListResp;
  fetchLtvList: (req: LtvReportListReq) => Promise<LtvReportListResp>;
} {
  const [ltvListState, setLtvListState] = useState<LtvReportListResp>({} as LtvReportListResp);
  const fetchLtvList = useCallback(async (req: LtvReportListReq) => {
    const resp = await http.get<LtvReportListResp>(`/api/report/ltv?${convertURLSearchParams(req)}`);
    setLtvListState(resp.data);
    return resp.data;
  }, []);

  return {
    ltvListState,
    fetchLtvList,
  }
}
