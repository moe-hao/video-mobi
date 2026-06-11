import { ChevronLeft } from "@gravity-ui/icons";
import { Button, Spinner, Tabs } from "@heroui/react";
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

export default function UserFeedback() {
  const toastQueue = useToast();
  const navigate = useNavigate();
  const { fetchFeedbackAdd } = useFeedbackAdd();
  const [loading, setLoading] = useState(false);

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
        <Button variant="ghost" isIconOnly onPress={() => navigate('/user/info')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-lg text-white">Feedback</h1>
        <div className="w-10" />
      </div>
      <div className="pt-16 p-4 ">
        <Tabs className="w-full max-w-md" onSelectionChange={(key) => setFeedbackAddReq({ ...feedbackAddReq, feedbackType: key as FeedbackType })}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id={FeedbackType.Bug}>
                Bug
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id={FeedbackType.Suggestion}>
                Suggestion
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id={FeedbackType.Payment}>
                Payment
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel className="pt-4" id={FeedbackType.Bug}>
            <BugTab feedbackAddReq={feedbackAddReq} onChange={setFeedbackAddReq} />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id={FeedbackType.Suggestion}>
            <SuggestionTab feedbackAddReq={feedbackAddReq} onChange={setFeedbackAddReq} />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id={FeedbackType.Payment}>
            <PaymentTab feedbackAddReq={feedbackAddReq} onChange={setFeedbackAddReq} />
          </Tabs.Panel>
        </Tabs>
      </div>
      <div className="px-6">
        <Button className="w-full bg-white text-black" variant="ghost" onClick={handleSubmit} isDisabled={loading}>
          {loading && <Spinner color="current" size="sm" />}
          Submit
        </Button>
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
