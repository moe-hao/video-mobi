import { request } from "@lib/common/utils/request-mobi";
import { useCallback } from "react";

export function useUserCancelSubscription(): {
  fetchUserCancelSubscription: () => Promise<void>;
} {
  const fetchUserCancelSubscription = useCallback(async () => {
    await request('/api/subscription/cancel', 'POST');
  }, [])

  return {
    fetchUserCancelSubscription,
  }
}
