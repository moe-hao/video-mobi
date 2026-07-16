import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { PaymentOptionAddReq, PaymentOptionContentItem, PaymentOptionDeleteReq, PaymentOptionEditReq, PaymentOptionListReq, PaymentOptionListResp } from "@lib/common/dto/payment-option";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function usePaymentOptionList(): {
  paymentOptionListState: PaymentOptionListResp;
  fetchPaymentOptionList: (req: PaymentOptionListReq) => Promise<PaymentOptionListResp>;
} {
  const [paymentOptionListState, setPaymentOptionListState] = useState<PaymentOptionListResp>({} as PaymentOptionListResp);

  const fetchPaymentOptionList = useCallback(async (req: PaymentOptionListReq) => {
    const result = await request<PaymentOptionListResp>(`/api/payment_option/list?${convertURLSearchParams(req)}`, "GET");
    setPaymentOptionListState(result);
    return result;
  }, []);

  return {
    paymentOptionListState,
    fetchPaymentOptionList,
  };
}

export function useAddPaymentOption(): {
  fetchAddPaymentOption: (req: PaymentOptionAddReq) => Promise<void>;
} {
  const fetchAddPaymentOption = useCallback(async (req: PaymentOptionAddReq) => {
    await request<void>("/api/payment_option/add", "POST", req);
  }, []);

  return {
    fetchAddPaymentOption,
  };
}

export function useEditPaymentOption(): {
  fetchEditPaymentOption: (req: PaymentOptionEditReq) => Promise<void>;
} {
  const fetchEditPaymentOption = useCallback(async (req: PaymentOptionEditReq) => {
    await request<void>("/api/payment_option/edit", "POST", req);
  }, []);

  return {
    fetchEditPaymentOption,
  };
}

export function useDeletePaymentOption(): {
  fetchDeletePaymentOption: (req: PaymentOptionDeleteReq) => Promise<void>;
} {
  const fetchDeletePaymentOption = useCallback(async (req: PaymentOptionDeleteReq) => {
    await request<void>("/api/payment_option/delete", "POST", req);
  }, []);

  return {
    fetchDeletePaymentOption,
  };
}

export function usePaymentOptionItems(): {
  fetchPaymentOptionItems: (paymentOptionId: number) => Promise<PaymentOptionContentItem[]>;
} {
  const fetchPaymentOptionItems = useCallback(async (paymentOptionId: number) => {
    const result = await request<PaymentOptionContentItem[]>(`/api/payment_option/items?paymentOptionId=${paymentOptionId}`, "GET");
    return result;
  }, []);

  return {
    fetchPaymentOptionItems,
  };
}
