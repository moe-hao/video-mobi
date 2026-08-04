import type { SkuAddReq, SkuManageListResp, SkuDeleteReq, SkuManageListReq, SkuEditReq } from "@lib/common/dto/sku";
import http from "@lib/common/utils/http/manage";
import { convertURLSearchParams } from "@lib/common/utils/param";
import { useCallback, useState } from "react";

export function useSkuList(): {
  skuManageListResp: SkuManageListResp,
  fetchSkuList: (req: SkuManageListReq) => Promise<SkuManageListResp>,
} {
  const [skuManageListResp, setSkuManageListResp] = useState<SkuManageListResp>({} as SkuManageListResp);

  const fetchSkuList = async (req: SkuManageListReq) => {
    const resp = await http.get<SkuManageListResp>(`/api/sku/list?${convertURLSearchParams(req)}`);
    setSkuManageListResp(resp.data);
    return resp.data;
  }

  return {
    skuManageListResp,
    fetchSkuList,
  }
}

export function useAddSku(): {
  fetchAddSku: (req: SkuAddReq) => Promise<void>,
} {
  const fetchAddSku = async (req: SkuAddReq) => {
    await http.post("/api/sku/add", req);
  }

  return {
    fetchAddSku,
  }
}

export function useEditSku(): {
  fetchEditSku: (req: SkuEditReq) => Promise<void>,
} {
  const fetchEditSku = async (req: SkuEditReq) => {
    await http.post("/api/sku/edit", req);
  }

  return {
    fetchEditSku,
  }
}

export function useDeleteSku(): {
  fetchDeleteSku: (req: SkuDeleteReq) => Promise<void>,
} {
  const fetchDeleteSku = useCallback(async (req: SkuDeleteReq) => {
    await http.post("/api/sku/delete", req);
  }, []);

  return {
    fetchDeleteSku,
  }
}
