import { useCallback } from "react";
import http from "@lib/common/utils/http/manage";

export function useSubscriptionCancel() {
  const cancelSubscription = useCallback(async (subscriptionId: number) => {
    await http.post('/api/subscription/cancel', { subscriptionId });
  }, []);

  return { cancelSubscription };
}
