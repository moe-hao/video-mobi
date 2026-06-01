import { useToast } from "@app/mobi-web/contexts/toast-context";
import { useUserCancelSubscription } from "@app/mobi-web/hooks/user/use-user-cancel-subscription";
import { Button, Link, Modal } from "@heroui/react";

export default function CancelSubscription() {
  const toastQueue = useToast();
  const { fetchUserCancelSubscription } = useUserCancelSubscription();

  const handleConfirmButton = async () => {
    await fetchUserCancelSubscription();
    toastQueue.add({
      title: "Cancel Subscription Success!",
      variant: "success",
      timeout: 1000,
    });
  }

  return (
    <Modal>
      <Link className="underline font-semibold text-gray-500 text-[10px]">Cancel Subscription</Link>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="w-full">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Cancel Subscription</Modal.Heading>
            </Modal.Header>
            <Modal.Footer>
              <Button className="w-full" slot="close" onClick={handleConfirmButton}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
