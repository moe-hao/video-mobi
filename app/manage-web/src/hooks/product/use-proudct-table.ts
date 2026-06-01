import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { ProductListResp } from "@lib/common/dto/product";

export function useProductTable(): {
  productTableState: ProductListResp;
  fetchProductTable: () => Promise<ProductListResp>;
} {
  const [productTableState, setProductTableState] = useState<ProductListResp>({} as ProductListResp);

  const fetchProductTable = useCallback(async () => {
    const result = await request<ProductListResp>("/api/product/list", "GET");
    setProductTableState(result);
    return result;
  }, []);

  return {
    productTableState,
    fetchProductTable,
  };
}
