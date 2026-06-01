import type { FeedbackAddReq } from "@lib/common/dto/feedback";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback } from "react";

export function useFeedbackAdd(): {
  fetchFeedbackAdd: (req: FeedbackAddReq) => Promise<void>;
} {
  const fetchFeedbackAdd = useCallback(async (req: FeedbackAddReq) => {
    await request('/api/feedback/add', 'POST', req);
  }, []);

  return {
    fetchFeedbackAdd,
  }
}
