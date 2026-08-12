import { useToast } from "@app/mobi-web/contexts/toast-context";
import { useUserCancelSubscription } from "@app/mobi-web/hooks/user/use-user-cancel-subscription";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CancelSubscription() {
  const toastQueue = useToast();
  const { fetchUserCancelSubscription } = useUserCancelSubscription();
  const { t } = useTranslation('', {keyPrefix: 'user-feedback'});
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmButton = async () => {
    await fetchUserCancelSubscription();
    toastQueue.add({
      title: "Cancel Subscription Success!",
      variant: "success",
      timeout: 1000,
    });
    setIsOpen(false);
  }

  return (
    <>
      <button
        className="underline font-semibold text-gray-500 text-[10px] bg-transparent border-none cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Cancel Subscription
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="relative bg-[#1a1f2e] rounded-[16px] p-6 w-[90%] max-w-[400px] z-[70]" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">{t('cancel-subscription')}</h2>
              <button className="bg-transparent border-none cursor-pointer text-white/70 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <button
              className="w-full py-3 bg-[#3D77FF] text-white rounded-lg border-none cursor-pointer font-bold"
              onClick={handleConfirmButton}
            >
              {t('submit')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
