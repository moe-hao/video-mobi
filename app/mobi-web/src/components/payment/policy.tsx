import { Button, Checkbox, Label, Link, Modal } from "@heroui/react";

export default function PaymentPolicyTips() {
  return (
    <div>
      <div className="flex justify-center">
        <Checkbox id="agree-to-terms" defaultSelected isDisabled={true}>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="agree-to-terms">I agree to the&nbsp;</Label>
          </Checkbox.Content>
        </Checkbox>
        <Modal>
          <Link className="underline font-semibold text-blue-500">Payment Terms</Link>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="w-full">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Blue Arc Payment Service Terms</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p>Content Types: Blue Arc includes both free and paid content.</p>
                  <p>Access Method: Paid content is exclusively accessible via an active subscription.</p>
                  <p>Unlimited Access: During your subscription period, all content can be viewed without limits.</p>
                  <p>Auto-Renewal: Subscriptions will automatically renew within 24 hours before the current period ends.</p>
                  <p>Cancellation: To cancel your subscription, please go to "Order Management" at least 24 hours before the current period expires.</p>
                  <p>Refund Policy: Subscriptions are non-refundable once they have been activated or used.</p>
                  <p>Customer Support: For any payment or billing inquiries, please contact us via "Me - Feedback."</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="w-full" slot="close">
                    Close
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  )
}
