import { Xmark } from "@gravity-ui/icons";
import { Button, Label, Link } from "@heroui/react";
import { useEffect, useState } from "react";
import PaymentPolicyTips from "./policy";
import { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import type { SkuListItem } from "@lib/common/dto/sku";
import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { Region } from "@lib/common/consts/region";
import PaymentButton from "./payment-button";

export default function PaymentModal({ skuInfo, onClose }: { skuInfo: SkuListItem; onClose: () => void }) {
  const { productInfo } = useVideoMobiContext();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
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
            onPress={onClose}
          >
            <Xmark />
          </Button>
        </div>
        <div className="flex items-end justify-center gap-1">
          <span className="text-[14px] pb-3 text-[#FFC525]">
            {skuInfo.currency}
          </span>
          <span className="text-[50px] font-[Anton] bg-gradient-to-r from-[#FFA200] via-amber-400 to-[#FFEC75] bg-clip-text text-transparent">
            {skuInfo.firstPeriodPrice !== '0.00' ?
              (String(skuInfo.firstPeriodPrice).endsWith('.00') ? String(skuInfo.firstPeriodPrice).slice(0, -3) : skuInfo.firstPeriodPrice) :
              (String(skuInfo.price).endsWith('.00') ? String(skuInfo.price).slice(0, -3) : skuInfo.price)
            }
          </span>
        </div>
        <div className="flex items-end justify-center gap-1">
          <span className="text-[12px] pb-6">
            Blue Arc Premium
          </span>
        </div>

        {
          skuInfo.paymentList?.map((item, index) => {
            if (item.paymentType === PaymentType.ApplePay && !(window as any).ApplePaySession) {
              return null;
            }
            return (
              <PaymentButton
                key={`${item.paymentType}-${index}`}
                bizId={skuInfo.bizId}
                paymentChannel={item.paymentChannel as PaymentChannel}
                paymentType={item.paymentType as PaymentType}
                loading={loading}
                onLoadingChange={setLoading}
              />
            );
          })
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
  );
}
