import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { RegionAddReq, RegionDeleteReq, RegionEditReq, RegionListReq, RegionListResp } from "@lib/common/dto/region";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useRegionList(): {
  regionListResp: RegionListResp;
  fetchRegionList: (req: RegionListReq) => Promise<RegionListResp>;
} {
  const [regionListResp, setRegionListResp] = useState<RegionListResp>({} as RegionListResp);

  const fetchRegionList = useCallback(async (req: RegionListReq) => {
    const result = await request<RegionListResp>(`/api/region/list?${convertURLSearchParams(req)}`, "GET");
    setRegionListResp(result);
    return result;
  }, []);

  return {
    regionListResp,
    fetchRegionList,
  };
}

export function useAddRegion(): {
  fetchAddRegion: (req: RegionAddReq) => Promise<void>;
} {
  const fetchAddRegion = useCallback(async (req: RegionAddReq) => {
    await request<void>("/api/region/add", "POST", req);
  }, []);

  return {
    fetchAddRegion,
  };
}

export function useEditRegion(): {
  fetchEditRegion: (req: RegionEditReq) => Promise<void>;
} {
  const fetchEditRegion = useCallback(async (req: RegionEditReq) => {
    await request<void>("/api/region/edit", "POST", req);
  }, []);

  return {
    fetchEditRegion,
  };
}

export function useDeleteRegion(): {
  fetchDeleteRegion: (req: RegionDeleteReq) => Promise<void>;
} {
  const fetchDeleteRegion = useCallback(async (req: RegionDeleteReq) => {
    await request<void>("/api/region/delete", "POST", req);
  }, []);

  return {
    fetchDeleteRegion,
  };
}
