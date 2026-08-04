import { useCallback, useState } from "react";
import type { PaymentOptionAddReq, PaymentOptionContentItem, PaymentOptionDeleteReq, PaymentOptionEditReq, PaymentOptionListReq, PaymentOptionListResp, PaymentOptionListRespItem } from "@lib/common/dto/payment-option";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function usePaymentOptionList(): {
  paymentOptionListState: PaymentOptionListResp;
  fetchPaymentOptionList: (req: PaymentOptionListReq) => Promise<PaymentOptionListResp>;
} {
  const [paymentOptionListState, setPaymentOptionListState] = useState<PaymentOptionListResp>({} as PaymentOptionListResp);

  const fetchPaymentOptionList = useCallback(async (req: PaymentOptionListReq) => {
    const resp = await http.get<PaymentOptionListResp>(`/api/payment_option/list?${convertURLSearchParams(req)}`);
    setPaymentOptionListState(resp.data);
    return resp.data;
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
    await http.post('/api/payment_option/add', req);
  }, []);

  return {
    fetchAddPaymentOption,
  };
}

export function useEditPaymentOption(): {
  fetchEditPaymentOption: (req: PaymentOptionEditReq) => Promise<void>;
} {
  const fetchEditPaymentOption = useCallback(async (req: PaymentOptionEditReq) => {
    await http.post('/api/payment_option/edit', req);
  }, []);

  return {
    fetchEditPaymentOption,
  };
}

export function useDeletePaymentOption(): {
  fetchDeletePaymentOption: (req: PaymentOptionDeleteReq) => Promise<void>;
} {
  const fetchDeletePaymentOption = useCallback(async (req: PaymentOptionDeleteReq) => {
    await http.post('/api/payment_option/delete', req);
  }, []);

  return {
    fetchDeletePaymentOption,
  };
}

export function usePaymentOptionItems(): {
  fetchPaymentOptionItems: (paymentOptionId: number) => Promise<PaymentOptionContentItem[]>;
} {
  const fetchPaymentOptionItems = useCallback(async (paymentOptionId: number) => {
    const resp = await http.get<PaymentOptionContentItem[]>(`/api/payment_option/items?paymentOptionId=${paymentOptionId}`);
    return resp.data;
  }, []);

  return {
    fetchPaymentOptionItems,
  };
}

export function useNormalPaymentOptionList(): {
  normalPaymentOptionList: PaymentOptionListRespItem[];
  fetchNormalPaymentOptionList: () => Promise<PaymentOptionListRespItem[]>;
} {
  const [normalPaymentOptionList, setNormalPaymentOptionList] = useState<PaymentOptionListRespItem[]>([]);

  const fetchNormalPaymentOptionList = useCallback(async () => {
    const resp = await http.get<PaymentOptionListRespItem[]>('/api/payment_option/normal_option_list');
    setNormalPaymentOptionList(resp.data);
    return resp.data;
  }, []);

  return {
    normalPaymentOptionList,
    fetchNormalPaymentOptionList,
  };
}
