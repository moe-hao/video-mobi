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
import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { useLocation, useSearchParams } from "react-router";
import { Region } from "@lib/common/consts/region";

export default function Payment() {
  const { t } = useTranslation('', { keyPrefix: 'payment' });
  const { fetchUserOrderCreate } = useUserOrderCreate();
  const { skuListRespState, fetchSkuList } = useSkuListState();
  const { productInfo } = useVideoMobiContext();

  const location = useLocation();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [skuInfo, setSkuInfo] = useState<SkuListItem>({} as SkuListItem);
  // const [shouldPaySkuId, setShouldPaySkuId] = useState<string>('');
  // const [paymentAmount, setPaymentAmount] = useState<string>('');

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
      pixelId: Number(searchParams.get('p')) || 0,
      reback: `${location.pathname}${location.search || ''}`,
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
                  {productInfo?.currencySign}{item.price}
                </h2>
              </div>
            </div>
          </div>
        ))
      }
      {showPaymentModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
          <div
            className="fixed bottom-0 left-0 right-0 text-white rounded-[16px] p-2 pb-6 z-50"
            style={{
              animation: 'slideUp 0.3s ease-out',
              background: 'linear-gradient(180deg, #2a3e63 0%, #1a1f2e 20%, #0d1117 100%)'
            }}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-white"></h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
                onPress={() => setShowPaymentModal(false)}
              >
                <Xmark />
              </Button>
            </div>
            <div className="flex items-end justify-center gap-1">
              <span className="text-[14px] pb-3 text-[#FFC525]">
                {productInfo?.currency}
              </span>
              <span className="text-[50px] font-[Anton] bg-gradient-to-r from-[#FFA200] via-amber-400 to-[#FFEC75] bg-clip-text text-transparent">
                {skuInfo.price}
              </span>
            </div>
            <div className="flex items-end justify-center gap-1">
              <span className="text-[12px] pb-6">
                Blue Arc Premium
              </span>
            </div>
            <Button
              size="lg"
              className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold h-full mb-4 px-4 py-4 rounded-[16px] relative"
              onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.Card)}
            >
              <CreditCard />
              <span className="ml-2">
                {t('credit-debit-card')}
              </span>
            </Button>
            <Button
              size="lg"
              className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold h-full mb-4 px-4 py-4 rounded-[16px] relative"
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
            {productInfo?.region === Region.TW && (
              <Button
                size="lg"
                className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold h-full mb-4 px-4 py-4 rounded-[16px] relative"
                onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.ApplePay)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 211" fill="#fff" style={{ width: '48px' }}>
                  <path d="M93.552 27.103c-6 7.1-15.602 12.702-25.203 11.901c-1.2-9.6 3.5-19.802 9.001-26.103C83.35 5.601 93.852.4 102.353 0c1 10.001-2.9 19.802-8.8 27.103Zm8.701 13.802c-13.902-.8-25.803 7.9-32.404 7.9c-6.7 0-16.802-7.5-27.803-7.3c-14.301.2-27.603 8.3-34.904 21.202c-15.002 25.803-3.9 64.008 10.601 85.01c7.101 10.401 15.602 21.802 26.803 21.402c10.602-.4 14.802-6.9 27.604-6.9c12.901 0 16.602 6.9 27.803 6.7c11.601-.2 18.902-10.4 26.003-20.802c8.1-11.801 11.401-23.303 11.601-23.903c-.2-.2-22.402-8.7-22.602-34.304c-.2-21.402 17.502-31.603 18.302-32.203c-10.002-14.802-25.603-16.402-31.004-16.802Zm80.31-29.004V167.82h24.202v-53.306h33.504c30.603 0 52.106-21.002 52.106-51.406c0-30.403-21.103-51.206-51.306-51.206h-58.507Zm24.202 20.403h27.903c21.003 0 33.004 11.201 33.004 30.903c0 19.702-12.001 31.004-33.104 31.004h-27.803V32.304ZM336.58 169.019c15.202 0 29.303-7.7 35.704-19.902h.5v18.702h22.403V90.21c0-22.502-18.002-37.004-45.706-37.004c-25.703 0-44.705 14.702-45.405 34.904h21.803c1.8-9.601 10.7-15.902 22.902-15.902c14.802 0 23.103 6.901 23.103 19.603v8.6l-30.204 1.8c-28.103 1.7-43.304 13.202-43.304 33.205c0 20.202 15.701 33.603 38.204 33.603Zm6.5-18.502c-12.9 0-21.102-6.2-21.102-15.702c0-9.8 7.901-15.501 23.003-16.401l26.903-1.7v8.8c0 14.602-12.401 25.003-28.803 25.003Zm82.01 59.707c23.603 0 34.704-9 44.405-36.304L512 54.706h-24.603l-28.503 92.11h-.5l-28.503-92.11h-25.303l41.004 113.513l-2.2 6.901c-3.7 11.701-9.701 16.202-20.402 16.202c-1.9 0-5.6-.2-7.101-.4v18.702c1.4.4 7.4.6 9.201.6Z" />
                </svg>
                <span className="ml-2">
                  Apple Pay
                </span>
              </Button>
            )}
            <PayPalButton skuInfo={skuInfo} />
            <PaymentPolicyTips />
            {
              productInfo?.region === Region.JP && (
                <>
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
                </>
              )
            }
          </div>
        </>
      )}
    </div>
  );
}
