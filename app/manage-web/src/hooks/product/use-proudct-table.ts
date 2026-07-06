import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { ProductAddReq, ProductEditReq, ProductListReq, ProductListResp } from "@lib/common/dto/product";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useProductTable(): {
  productTableState: ProductListResp;
  fetchProductTable: (req: ProductListReq) => Promise<ProductListResp>;
} {
  const [productTableState, setProductTableState] = useState<ProductListResp>({} as ProductListResp);

  const fetchProductTable = useCallback(async (req: ProductListReq) => {
    const result = await request<ProductListResp>(`/api/product/list?${convertURLSearchParams(req)}`, "GET");
    setProductTableState(result);
    return result;
  }, []);

  return {
    productTableState,
    fetchProductTable,
  };
}

export function useAddProduct(): {
  fetchAddProduct: (req: ProductAddReq) => Promise<void>;
} {
  const fetchAddProduct = useCallback(async (req: ProductAddReq) => {
    await request<void>("/api/product/add", "POST", req);
  }, []);

  return {
    fetchAddProduct,
  };
}

export function useEditProduct(): {
  fetchEditProduct: (req: ProductEditReq) => Promise<void>;
} {
  const fetchEditProduct = useCallback(async (req: ProductEditReq) => {
    await request<void>("/api/product/edit", "POST", req);
  }, []);

  return {
    fetchEditProduct,
  };
}
