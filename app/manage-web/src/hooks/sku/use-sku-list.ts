import type { SkuAddReq, SkuManageListResp, SkuDeleteReq, SkuManageListReq, SkuEditReq } from "@lib/common/dto/sku";
import { convertURLSearchParams } from "@lib/common/utils/param";
import { request } from "@lib/common/utils/request-manage";
import { useCallback, useState } from "react";

export function useSkuList(): {
  skuManageListResp: SkuManageListResp,
  fetchSkuList: (req: SkuManageListReq) => Promise<SkuManageListResp>,
} {
  const [skuManageListResp, setSkuManageListResp] = useState<SkuManageListResp>({} as SkuManageListResp);

  const fetchSkuList = async (req: SkuManageListReq) => {
    const result = await request<SkuManageListResp>(`/api/sku/list?${convertURLSearchParams(req)}`, "GET");
    setSkuManageListResp(result);
    return result;
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
    await request<void>("/api/sku/add", "POST", req);
  }

  return {
    fetchAddSku,
  }
}

export function useEditSku(): {
  fetchEditSku: (req: SkuEditReq) => Promise<void>,
} {
  const fetchEditSku = async (req: SkuEditReq) => {
    await request<void>("/api/sku/edit", "POST", req);
  }

  return {
    fetchEditSku,
  }
}

export function useDeleteSku(): {
  fetchDeleteSku: (req: SkuDeleteReq) => Promise<void>,
} {
  const fetchDeleteSku = useCallback(async (req: SkuDeleteReq) => {
    await request<void>("/api/sku/delete", "POST", req);
  }, []);

  return {
    fetchDeleteSku,
  }
}
