import { ChevronLeft } from "@gravity-ui/icons";
import BugTab from "./bug";
import SuggestionTab from "./suggestion";
import PaymentTab from "./payment";
import { useState } from "react";
import { useNavigate } from "react-router";
import CancelSubscription from "./cancel-subscription";
import { useToast } from "@app/mobi-web/contexts/toast-context";
import type { FeedbackAddReq } from "@lib/common/dto/feedback";
import { useFeedbackAdd } from "@app/mobi-web/hooks/feedback";
import { FeedbackType } from "@lib/common/consts/feedback";
import { useTranslation } from "react-i18next";

const tabs = [
  { id: FeedbackType.Bug, labelKey: 'bug' },
  { id: FeedbackType.Suggestion, labelKey: 'suggestion' },
  { id: FeedbackType.Payment, labelKey: 'payment' },
];

export default function UserFeedback() {
  const toastQueue = useToast();
  const navigate = useNavigate();
  const { fetchFeedbackAdd } = useFeedbackAdd();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('', {keyPrefix: 'user-feedback'});

  const [feedbackAddReq, setFeedbackAddReq] = useState<FeedbackAddReq>({
    feedbackType: FeedbackType.Bug,
    email: '',
    description: '',
    feedbackBusinessId: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    await fetchFeedbackAdd(feedbackAddReq);
    toastQueue.add({
      title: "Submit Feedback Success!",
      variant: "success",
      timeout: 1000,
    })
    navigate('/user/info');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <button className="bg-transparent border-none cursor-pointer text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => navigate('/user/info')}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg text-white">Feedback</h1>
        <div className="w-10" />
      </div>
      <div className="pt-16 p-4">
        <div className="w-full max-w-md">
          <div className="flex border-b border-white/10 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`flex-1 py-3 text-sm font-medium bg-transparent border-none cursor-pointer relative ${feedbackAddReq.feedbackType === tab.id ? 'text-white' : 'text-white/50'}`}
                onClick={() => setFeedbackAddReq({ ...feedbackAddReq, feedbackType: tab.id })}
              >
                {t(tab.labelKey)}
                {feedbackAddReq.feedbackType === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />
                )}
              </button>
            ))}
          </div>
          <div className="pt-4">
            {feedbackAddReq.feedbackType === FeedbackType.Bug && (
              <BugTab feedbackAddReq={feedbackAddReq} onChange={setFeedbackAddReq} />
            )}
            {feedbackAddReq.feedbackType === FeedbackType.Suggestion && (
              <SuggestionTab feedbackAddReq={feedbackAddReq} onChange={setFeedbackAddReq} />
            )}
            {feedbackAddReq.feedbackType === FeedbackType.Payment && (
              <PaymentTab feedbackAddReq={feedbackAddReq} onChange={setFeedbackAddReq} />
            )}
          </div>
        </div>
      </div>
      <div className="px-6">
        <button
          className="w-full py-3 bg-white text-black rounded-lg border-none cursor-pointer font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
          {t('submit')}
        </button>
      </div>
      {
        feedbackAddReq.feedbackType === FeedbackType.Payment && (
          <div className="flex justify-center mt-4">
            <CancelSubscription />
          </div>
        )
      }
    </div>
  );
}
