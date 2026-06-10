import { CreditCard, Xmark } from "@gravity-ui/icons";
import { Button, Label, Link } from "@heroui/react";
import { useEffect, useState } from "react";
import PaymentPolicyTips from "./policy";
import { useTranslation } from "react-i18next";
import PayPalButton from "./paypal-button";
import { useUserOrderCreate } from "@app/mobi-web/hooks/user";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { useSkuListState } from "@app/mobi-web/hooks/sku";
import type { SkuListItem } from "@lib/common/dto/sku";
import { PeriodType, PeriodTypeToName } from "@lib/common/consts/subscription";
import { SkuImportant } from "@lib/common/consts/sku";

export default function Payment() {
  const { t } = useTranslation('', { keyPrefix: 'payment' });
  const { fetchUserOrderCreate } = useUserOrderCreate();
  const { skuListRespState, fetchSkuList } = useSkuListState();

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  // const [shouldPaySkuId, setShouldPaySkuId] = useState<string>('');
  // const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [skuInfo, setSkuInfo] = useState<SkuListItem>({} as SkuListItem);

  useEffect(() => {
    fetchSkuList();
  }, []);

  const handleClickStoreCard = (skuInfo: SkuListItem) => {
    // setShouldPaySkuId(skuId);
    // setPaymentAmount(paymentAmount);
    setSkuInfo(skuInfo);
    setShowPaymentModal(true);
  }

  const handleClickPayment = async (paymentChannel: PaymentChannel, paymentType: PaymentType) => {
    const result = await fetchUserOrderCreate({
      sku: skuInfo.bizId,
      paymentChannel,
      paymentType,
    });

    window.location.href = result.redirectUrl;
  }

  return (
    <div className="mt-auto flex w-full flex-col items-start gap-6">
      {
        skuListRespState.skuList?.map((item) => (
            <div
              className={
                item.important === SkuImportant.Yes ? "w-full bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] h-full px-4 py-4 rounded-[16px] relative" : "w-full bg-white/10 backdrop-blur-sm border-white/20 h-full px-4 py-4 rounded-[16px] relative"
              }
              key={item.bizId}
              onClick={() => handleClickStoreCard(item)}
            >
              {item.desc && (
                <span className="absolute -top-2.5 right-[16px] text-[10px] font-bold text-black bg-white px-2 py-1 rounded-[8px] backdrop-blur-sm">
                  {item.desc}
                </span>
              )}
              <div className="flex flex-row items-center justify-between gap-4 p-2">
                <div className="flex flex-1 flex-col gap-1">
                  <h2 className="text-[16px] italic text-white font-[Anton] truncate tracking-wider">
                    {t(`${PeriodTypeToName[item.periodType as PeriodType]}-vip`)}
                  </h2>
                </div>
                <div className="flex shrink-0 flex-col gap-1 items-end">
                  <h2 className="text-[16px] text-white font-[Anton] whitespace-nowrap tracking-wider">
                    {t(`${PeriodTypeToName[item.periodType as PeriodType]}-vip-amount`, { amount: `$${item.price}` })}
                  </h2>
                </div>
              </div>
            </div>
        ))
      }
      {showPaymentModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm pointer-events-none"
          />
          <div
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black text-white rounded-t-3xl p-6 z-50"
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-white">{t('payment-title')}</h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
                onPress={() => setShowPaymentModal(false)}
              >
                <Xmark />
              </Button>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    R${skuInfo.price}
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full h-[50px] bg-gradient-to-r text-white font-bold text-xl mb-4 bg-[#2C2E2F]"
              onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.Card)}
            >
              <CreditCard />
              <span className="ml-2">
                {t('credit-debit-card')}
              </span>
            </Button>
            <Button
              size="lg"
              className="w-full h-[50px] bg-gradient-to-r text-white font-bold text-xl mb-4 bg-[#2C2E2F]"
              onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.GooglePay)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.456 10.154c.123.659.19 1.348.19 2.067c0 5.624-3.764 9.623-9.449 9.623A9.84 9.84 0 0 1 2.353 12a9.84 9.84 0 0 1 9.844-9.844c2.658 0 4.879.978 6.583 2.566l-2.775 2.775V7.49c-1.033-.984-2.344-1.489-3.808-1.489c-3.248 0-5.888 2.744-5.888 5.993s2.64 5.999 5.888 5.999c2.947 0 4.953-1.686 5.365-4h-5.365v-3.839z"
                />
              </svg>
              <span className="ml-2">
                {t('google-pay')}
              </span>
            </Button>
            <PayPalButton skuInfo={skuInfo} />
            <PaymentPolicyTips />
            <div className="flex justify-center pt-1">
              <Label className="opacity-50 cursor-default text-xs">
                <Link href="/terms/settlement.html">資金決済法に基づく表示</Link>
              </Label>
            </div>
            <div className="flex justify-center pt-1">
              <Label className="opacity-50 cursor-default text-xs">
                <Link href="/terms/specified.html">特定商取引法に基づく表示</Link>
              </Label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
