import { useCallback, useState } from "react";
import type { RetrieveOptionAddReq, RetrieveOptionEditReq, RetrieveOptionListReq, RetrieveOptionListResp } from "@lib/common/dto/retrieve-option";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useRetrieveOptionTable(): {
  retrieveOptionTableState: RetrieveOptionListResp;
  fetchRetrieveOptionTable: (req: RetrieveOptionListReq) => Promise<RetrieveOptionListResp>;
} {
  const [retrieveOptionTableState, setRetrieveOptionTableState] = useState<RetrieveOptionListResp>({} as RetrieveOptionListResp);

  const fetchRetrieveOptionTable = useCallback(async (req: RetrieveOptionListReq) => {
    const resp = await http.get<RetrieveOptionListResp>(`/api/member_retrieve/list?${convertURLSearchParams(req)}`);
    setRetrieveOptionTableState(resp.data);
    return resp.data;
  }, []);

  return {
    retrieveOptionTableState,
    fetchRetrieveOptionTable,
  };
}

export function useAddRetrieveOption(): {
  fetchAddRetrieveOption: (req: RetrieveOptionAddReq) => Promise<void>;
} {
  const fetchAddRetrieveOption = useCallback(async (req: RetrieveOptionAddReq) => {
    await http.post("/api/member_retrieve/add", req);
  }, []);

  return {
    fetchAddRetrieveOption,
  };
}

export function useEditRetrieveOption(): {
  fetchEditRetrieveOption: (req: RetrieveOptionEditReq) => Promise<void>;
} {
  const fetchEditRetrieveOption = useCallback(async (req: RetrieveOptionEditReq) => {
    await http.post("/api/member_retrieve/edit", req);
  }, []);

  return {
    fetchEditRetrieveOption,
  };
}

export function useDeleteRetrieveOption(): {
  fetchDeleteRetrieveOption: (id: number) => Promise<void>;
} {
  const fetchDeleteRetrieveOption = useCallback(async (id: number) => {
    await http.post("/api/member_retrieve/delete", { id });
  }, []);

  return {
    fetchDeleteRetrieveOption,
  };
}
