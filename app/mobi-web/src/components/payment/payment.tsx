import { Xmark } from "@gravity-ui/icons";
import { Button, Label, Link } from "@heroui/react";
import { useEffect, useState } from "react";
import PaymentPolicyTips from "./policy";
import { useTranslation } from "react-i18next";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import { useSkuListState } from "@app/mobi-web/hooks/sku";
import type { SkuListItem } from "@lib/common/dto/sku";
import { PeriodType, PeriodTypeToName } from "@lib/common/consts/subscription";
import { SkuImportant, SkuType } from "@lib/common/consts/sku";
import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { Region } from "@lib/common/consts/region";
import PaymentButton from "./payment-button";

export default function Payment() {
  const { t } = useTranslation('', { keyPrefix: 'payment' });

  const { skuListRespState, fetchSkuList } = useSkuListState();
  const { productInfo } = useVideoMobiContext();
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [skuInfo, setSkuInfo] = useState<SkuListItem>({} as SkuListItem);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSkuList();
  }, []);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleClickStoreCard = (skuInfo: SkuListItem) => {
    setSkuInfo(skuInfo);
    setShowPaymentModal(true);
  }

  return (
    <div className="mt-auto flex w-full flex-col items-start gap-5">
      {
        skuListRespState.skuList?.map((item) => item.skuType === SkuType.Subscription && (
          <div
            className={
              item.important === SkuImportant.Yes ? "w-full bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] min-h-[70px] px-4 rounded-[16px] relative flex flex-col justify-center py-2" : "w-full bg-white/10 backdrop-blur-sm border-white/20 min-h-[70px] px-4 rounded-[16px] relative flex flex-col justify-center py-2"
            }
            key={item.bizId}
            onClick={() => handleClickStoreCard(item)}
          >
            {item.desc && (
              <span className="absolute -top-2.5 right-[16px] text-[10px] font-bold text-black bg-white px-2 py-1 rounded-[8px] backdrop-blur-sm">
                {item.desc}
              </span>
            )}
            <div className="flex flex-row items-center justify-between gap-2 flex-1">
              <h2 className="text-[16px] italic text-white font-[Anton] tracking-wider flex-1 min-w-0">
                {t(`${PeriodTypeToName[item.periodType as PeriodType]}-vip`)}
              </h2>
              <div className="flex shrink-0 flex-col items-end">
                <h2>
                  <span className="text-[12px] text-white/60 mr-2">
                    {item.firstPeriodPrice !== '0.00' ? t('trial') : ''}
                  </span>
                  <span className="text-[16px] text-white font-[Anton] whitespace-nowrap tracking-wider leading-tight">
                    {item.currencySign}{item.firstPeriodPrice !== '0.00'
                      ? (String(item.firstPeriodPrice).endsWith('.00') ? String(item.firstPeriodPrice).slice(0, -3) : item.firstPeriodPrice)
                      : (String(item.price).endsWith('.00') ? String(item.price).slice(0, -3) : item.price)
                    }
                  </span>
                </h2>
              </div>
            </div>
            <div className="flex justify-end -mt-3">
              <span className={`text-[12px] line-through leading-tight ${item.firstPeriodPrice !== '0.00' ? 'text-white/60' : 'invisible'}`}>
                {item.currencySign}{String(item.price).endsWith('.00') ? String(item.price).slice(0, -3) : item.price}
              </span>
            </div>
          </div>
        ))
      }
      {skuListRespState.skuList?.some((item) => item.skuType === SkuType.Coin) && (
        <h2 className="text-[16px] font-bold text-white tracking-wider">Coin Recharge</h2>
      )}
      <div className="flex flex-row gap-3 overflow-x-auto overflow-y-visible scrollbar-hide pt-3 overscroll-x-contain touch-pan-x" style={{ width: 'calc(100% + 2rem)', marginLeft: '-1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {
          skuListRespState.skuList?.map((item) => item.skuType === SkuType.Coin && (
            <div
              className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-4 rounded-[16px] relative shrink-0 min-w-[140px]"
              key={item.bizId}
              onClick={() => handleClickStoreCard(item)}
            >
              <span
                className={`absolute left-0 -top-[12px] w-[66px] h-[24px] rounded-t-[16px] rounded-br-[16px] text-[10px] font-bold text-black flex items-center justify-center ${!item.desc ? "invisible" : ""}`}
                style={{ background: 'linear-gradient(110deg, #fff37c 0%, #fcba48 100%)' }}
              >
                {item.desc}
              </span>
              <div className="flex flex-col gap-1 items-center">
                <h2 className="text-[16px] text-white font-bold truncate">
                  {item.coinNum} coins
                </h2>
                <div className={`text-[#FFD83D] leading-[20px] h-[20px] ${!item.coinBonus ? "invisible" : ""}`}>
                  {item.coinBonus ? `+${item.coinBonus}` : "\u00A0"}
                </div>
                <div
                  className={
                    item.important === SkuImportant.Yes
                      ? 'min-w-[88px] px-3 h-[36px] rounded-[14px] bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] flex items-center justify-center whitespace-nowrap'
                      : 'min-w-[88px] px-3 h-[36px] rounded-[14px] bg-white/10 flex items-center justify-center whitespace-nowrap'
                  }
                >
                  {item.currencySign}{String(item.price).endsWith('.00') ? String(item.price).slice(0, -3) : item.price}
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
          {loading && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <div
            className={`fixed bottom-0 left-0 right-0 text-white rounded-[16px] p-2 pb-6 z-50 ${loading ? 'pointer-events-none' : ''}`}
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
                {skuInfo.currency}
              </span>
              <span className="text-[50px] font-[Anton] bg-gradient-to-r from-[#FFA200] via-amber-400 to-[#FFEC75] bg-clip-text text-transparent">
                {String(skuInfo.price).endsWith('.00') ? String(skuInfo.price).slice(0, -3) : skuInfo.price}
              </span>
            </div>
            <div className="flex items-end justify-center gap-1">
              <span className="text-[12px] pb-6">
                Blue Arc Premium
              </span>
            </div>

            {
              skuInfo.paymentList?.map((item, index) => (
                <PaymentButton key={index} bizId={skuInfo.bizId} paymentChannel={item.paymentChannel as PaymentChannel} paymentType={item.paymentType as PaymentType} loading={loading} onLoadingChange={setLoading} />
              ))
            }

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
