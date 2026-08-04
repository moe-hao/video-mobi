import type { ProductListRespItem } from "@lib/common/dto/product";
import http from "@lib/common/utils/http/manage";
import { useCallback, useState } from "react";

export function useProductList(): {
  productList: ProductListRespItem[],
  fetchProductList: () => Promise<ProductListRespItem[]>
} {
  const [productList, setProductList] = useState<ProductListRespItem[]>([]);
  const fetchProductList = useCallback(async () => {
    const resp = await http.get<ProductListRespItem[]>('/api/product/all');
    setProductList(resp.data);
    return resp.data;
  }, []);

  return {
    productList,
    fetchProductList,
  };
}
