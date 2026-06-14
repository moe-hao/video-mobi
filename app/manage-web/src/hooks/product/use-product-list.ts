import type { ProductListRespItem } from "@lib/common/dto/product";
import { request } from "@lib/common/utils/request-manage";
import { useCallback, useState } from "react";

export function useProductList(): {
  productList: ProductListRespItem[],
  fetchProductList: () => Promise<ProductListRespItem[]>
} {
  const [productList, setProductList] = useState<ProductListRespItem[]>([]);
  const fetchProductList = useCallback(async () => {
    const result = await request<ProductListRespItem[]>('/api/product/all', 'GET');
    setProductList(result);
    return result;
  }, []);

  return {
    productList,
    fetchProductList,
  };
}
