import { Xmark } from "@gravity-ui/icons";
import { Button, Label, Link } from "@heroui/react";
import { useEffect, useState } from "react";
import PaymentPolicyTips from "./policy";
import { useTranslation } from "react-i18next";
// import PayPalButton from "./paypal-button";
import { useUserOrderCreate } from "@app/mobi-web/hooks/user";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { useSkuListState } from "@app/mobi-web/hooks/sku";
import type { SkuListItem } from "@lib/common/dto/sku";
import { PeriodType, PeriodTypeToName } from "@lib/common/consts/subscription";
import { SkuImportant, SkuType } from "@lib/common/consts/sku";
import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { useLocation, useSearchParams } from "react-router";
import { Region } from "@lib/common/consts/region";
import PixButton from "./pix-button";

export default function Payment() {
  const { t } = useTranslation('', { keyPrefix: 'payment' });
  const { fetchUserOrderCreate } = useUserOrderCreate();
  const { skuListRespState, fetchSkuList } = useSkuListState();
  const { productInfo } = useVideoMobiContext();

  const location = useLocation();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [skuInfo, setSkuInfo] = useState<SkuListItem>({} as SkuListItem);

  useEffect(() => {
    fetchSkuList();
  }, []);

  const handleClickStoreCard = (skuInfo: SkuListItem) => {
    setSkuInfo(skuInfo);
    setShowPaymentModal(true);
  }

  const handleClickPayment = async (paymentChannel: PaymentChannel, paymentType: PaymentType) => {
    const ad = {
      ad_id: searchParams.get('creative_id') || '',
      adset_id: searchParams.get('adset_id') || '',
      campaign_id: searchParams.get('campaign_id') || '',
      fbclid: searchParams.get('fbclid') || '',
      ttclid: searchParams.get('ttclid') || '',
      collectionId: searchParams.get('collectionId') || '',
    }

    const result = await fetchUserOrderCreate({
      sku: skuInfo.bizId,
      paymentChannel,
      paymentType,
      pixelId: Number(searchParams.get('p')) || 0,
      reback: `${location.pathname}${location.search || ''}`,
      ad: JSON.stringify(ad),
      pixCPF: '',
      firstName: '',
      lastName: '',
    });

    window.location.href = result.redirectUrl;
  }

  const handlePixSubmit = async (data: { cpf: string; firstName: string; lastName: string }) => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout');
    }
    const ad = {
      ad_id: searchParams.get('creative_id') || '',
      adset_id: searchParams.get('adset_id') || '',
      campaign_id: searchParams.get('campaign_id') || '',
      fbclid: searchParams.get('fbclid') || '',
      ttclid: searchParams.get('ttclid') || '',
      collectionId: searchParams.get('collectionId') || '',
    }

    const result = await fetchUserOrderCreate({
      sku: skuInfo.bizId,
      paymentChannel: PaymentChannel.Payssion,
      paymentType: PaymentType.Pix,
      pixelId: Number(searchParams.get('p')) || 0,
      reback: `${location.pathname}${location.search || ''}`,
      ad: JSON.stringify(ad),
      pixCPF: data.cpf,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    window.location.href = result.redirectUrl;
  }

  return (
    <div className="mt-auto flex w-full flex-col items-start gap-5">
      {
        skuListRespState.skuList?.map((item) => item.skuType === SkuType.Subscription && (
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
      {skuListRespState.skuList?.some((item) => item.skuType === SkuType.Coin) && (
        <h2 className="text-[16px] font-bold text-white tracking-wider">Coin Recharge</h2>
      )}
      <div className="flex flex-row gap-3 overflow-x-auto overflow-y-visible scrollbar-hide pt-[12px] overscroll-x-contain touch-pan-x" style={{ width: 'calc(100% + 2rem)', marginLeft: '-1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {
          skuListRespState.skuList?.map((item) => item.skuType === SkuType.Coin && (
            <div
              className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-4 rounded-[16px] relative shrink-0 w-[140px]"
              key={item.bizId}
              onClick={() => handleClickStoreCard(item)}
            >
              {item.desc && (
                <span
                  className="absolute left-0 -top-[12px] w-[66px] h-[24px] rounded-t-[16px] rounded-br-[16px] text-[10px] font-bold text-black flex items-center justify-center"
                  style={{ background: 'linear-gradient(110deg, #fff37c 0%, #fcba48 100%)' }}
                >
                  {item.desc}
                </span>
              )}
              <div className="flex flex-col gap-1 items-center">
                <h2 className="text-[16px] text-white font-bold truncate">
                  {item.coinNum} coins
                </h2>
                <div className="text-[#FFD83D]">+300</div>
                <div
                  className={
                    item.important === SkuImportant.Yes
                      ? 'w-[88px] h-[36px] rounded-[14px] bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] flex items-center justify-center'
                      : 'w-[88px] h-[36px] rounded-[14px] bg-white/10 flex items-center justify-center'
                  }
                >
                  {productInfo?.currencySign}{item.price}
                </div>
              </div>
            </div>
          ))
        }
      </div>


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
              className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
              onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.Card)}
            >
              <img src="https://i.bluearcshow.com/images/B0_Card.png" alt="Credit Card" className="w-8" />
              <span className="ml-2">
                {t('credit-debit-card')}
              </span>
            </Button>
            <Button
              size="lg"
              className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
              onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.GooglePay)}
            >
              <img src="https://i.bluearcshow.com/images/Google_Pay_Global.png" alt="Google Pay" className="w-8" />
              <span className="ml-2">
                {t('google-pay')}
              </span>
            </Button>
            <Button
              size="lg"
              className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
              onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.ApplePay)}
            >
              <img src="https://i.bluearcshow.com/images/Apple_Pay_Global.png" alt="Apple Pay" className="w-8" />
              <span className="ml-2">
                Apple Pay
              </span>
            </Button>
            {productInfo?.region === Region.BR && (
              <>
                <PixButton onSubmit={handlePixSubmit} />
                {/* <Button
                  size="lg"
                  className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
                  onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.Pix)}
                >
                  <img src="https://i.bluearcshow.com/images/PIX_BR.png" alt="Pix" className="w-8" />
                  <span className="ml-2">
                    Pix
                  </span>
                </Button> */}
                <Button
                  size="lg"
                  className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
                  onPress={() => handleClickPayment(PaymentChannel.Payermax, PaymentType.MercadoPago)}
                >
                  <img src="https://i.bluearcshow.com/images/Mercado_Pago_BR.png" alt="MercadoPago" className="w-8" />
                  <span className="ml-2">
                    MercadoPago
                  </span>
                </Button>
              </>
            )}
            {/* <PayPalButton skuInfo={skuInfo} /> */}
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
