import { useState } from "react";

export default function PaymentPolicyTips() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-center items-center">
        <input
          type="checkbox"
          id="agree-to-terms"
          checked={true}
          disabled={true}
          className="w-4 h-4 mr-2 accent-blue-500"
        />
        <label htmlFor="agree-to-terms" className="text-sm">
          I agree to the&nbsp;
        </label>
        <button
          className="underline font-semibold text-blue-500 bg-transparent border-none cursor-pointer text-sm"
          onClick={() => setIsOpen(true)}
        >
          Payment Terms
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="relative bg-[#1a1f2e] rounded-[16px] p-6 w-[90%] max-w-[400px] z-[70]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Blue Arc Payment Service Terms</h2>
              <button className="bg-transparent border-none cursor-pointer text-white/70 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <div className="text-white/80 text-sm space-y-3">
              <p>Content Types: Blue Arc includes both free and paid content.</p>
              <p>Access Method: Paid content is exclusively accessible via an active subscription.</p>
              <p>Unlimited Access: During your subscription period, all content can be viewed without limits.</p>
              <p>Auto-Renewal: Subscriptions will automatically renew within 24 hours before the current period ends.</p>
              <p>Cancellation: To cancel your subscription, please go to "Order Management" at least 24 hours before the current period expires.</p>
              <p>Refund Policy: Subscriptions are non-refundable once they have been activated or used.</p>
              <p>Customer Support: For any payment or billing inquiries, please contact us via "Me - Feedback."</p>
            </div>
            <button
              className="w-full py-3 mt-6 bg-[#3D77FF] text-white rounded-lg border-none cursor-pointer font-bold"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
