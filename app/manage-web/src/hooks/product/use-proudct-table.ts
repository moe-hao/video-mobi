import { useCallback, useState } from "react";
import type { ProductAddReq, ProductEditReq, ProductListReq, ProductListResp } from "@lib/common/dto/product";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useProductTable(): {
  productTableState: ProductListResp;
  fetchProductTable: (req: ProductListReq) => Promise<ProductListResp>;
} {
  const [productTableState, setProductTableState] = useState<ProductListResp>({} as ProductListResp);

  const fetchProductTable = useCallback(async (req: ProductListReq) => {
    const resp = await http.get<ProductListResp>(`/api/product/list?${convertURLSearchParams(req)}`);
    setProductTableState(resp.data);
    return resp.data;
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
    await http.post("/api/product/add", req);
  }, []);

  return {
    fetchAddProduct,
  };
}

export function useEditProduct(): {
  fetchEditProduct: (req: ProductEditReq) => Promise<void>;
} {
  const fetchEditProduct = useCallback(async (req: ProductEditReq) => {
    await http.post("/api/product/edit", req);
  }, []);

  return {
    fetchEditProduct,
  };
}
