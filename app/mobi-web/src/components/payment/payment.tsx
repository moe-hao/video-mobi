import { useEffect, useState } from "react";
import { useSkuListState } from "@app/mobi-web/hooks/sku";
import type { SkuListItem } from "@lib/common/dto/sku";
import SubscriptionCards from "./subscription-cards";
import CoinRecharge from "./coin-recharge";
import RetrieveModal, { addRetrieveCount, isRetrieveThresholdMet } from "./retrieve-count";
import PaymentModal from "./payment-modal";

export default function Payment() {
  const { skuListRespState, fetchSkuList } = useSkuListState();
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [skuInfo, setSkuInfo] = useState<SkuListItem>({} as SkuListItem);
  const [showRetrieveAfterPayment, setShowRetrieveAfterPayment] = useState(false);

  useEffect(() => {
    fetchSkuList();
  }, []);

  const handleClickStoreCard = (skuInfo: SkuListItem) => {
    setSkuInfo(skuInfo);
    setShowPaymentModal(true);
    setShowRetrieveAfterPayment(false);
    addRetrieveCount("payment");
  }

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    isRetrieveThresholdMet().then((isMet) => {
      if (isMet) {
        setShowRetrieveAfterPayment(true);
      }
    });
  }

  return (
    <div className="mt-auto flex w-full flex-col items-start gap-5">
      {showRetrieveAfterPayment && (
        <RetrieveModal
          skuInfo={skuListRespState?.skuList?.find((item) => item.isRetrieve === 1) || {} as SkuListItem}
          onPay={handleClickStoreCard}
          onClose={() => setShowRetrieveAfterPayment(false)}
        />
      )}
      <SubscriptionCards skuListRespState={skuListRespState} handleClickStoreCard={handleClickStoreCard} />
      <CoinRecharge skuListRespState={skuListRespState} handleClickStoreCard={handleClickStoreCard} />

      {showPaymentModal && (
        <PaymentModal skuInfo={skuInfo} onClose={handleClosePayment} />
      )}
    </div>
  );
}
