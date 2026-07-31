import { useCallback } from "react";
import { request } from "@lib/common/utils/request-manage";

export function useSubscriptionCancel() {
  const cancelSubscription = useCallback(async (subscriptionId: number) => {
    await request('/api/subscription/cancel', 'POST', { subscriptionId });
  }, []);

  return { cancelSubscription };
}
