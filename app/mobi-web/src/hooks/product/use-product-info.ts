import type { ProductInfoResp } from "@lib/common/dto/product";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback, useState } from "react";

export function useProductInfo(): {
  productInfoState: ProductInfoResp | undefined;
  fetchProductInfo: () => Promise<ProductInfoResp>;
} {
  const [productInfoState, setProductInfoState] = useState<ProductInfoResp>();

  const fetchProductInfo = useCallback(async () => {
    const productInfo = await request<ProductInfoResp>('/api/product/info', 'GET');
    setProductInfoState(productInfo);
    return productInfo;
  }, []);

  return {
    productInfoState,
    fetchProductInfo,
  }
}
