import { Button, Link } from "@heroui/react";
import { RelationType } from "@lib/common/consts/relation";
import { PeriodType, PeriodTypeToName } from "@lib/common/consts/subscription";
import type { SkuListItem, SkuRetrieveInfo } from "@lib/common/dto/sku";
import { request } from "@lib/common/utils/request-mobi";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type RetrieveCount = {
  date: string;
  orderNum: number;
  paymentNum: number;
}

export function addRetrieveCount(addNumType: "order" | "payment"): RetrieveCount {
  const storage = localStorage.getItem("retrieve") || "{}";
  const data = JSON.parse(storage) as RetrieveCount;
  const date = new Date().toLocaleDateString();

  if (data.date === date) {
    data.orderNum += addNumType === "order" ? 1 : 0;
    data.paymentNum += addNumType === "payment" ? 1 : 0;
    localStorage.setItem("retrieve", JSON.stringify(data));
    return data;
  }

  const newData = {
    date,
    orderNum: addNumType === "order" ? 1 : 0,
    paymentNum: addNumType === "payment" ? 1 : 0,
  };

  localStorage.setItem("retrieve", JSON.stringify(newData));
  return newData;
}

export async function isRetrieveThresholdMet(): Promise<boolean> {
  try {
    const retrieveInfo = await request<SkuRetrieveInfo>('/api/sku/retrieve_info', 'GET');
    if (!retrieveInfo.exist) {
      return false;
    }

    const storage = localStorage.getItem("retrieve");
    if (!storage) return false;

    const data = JSON.parse(storage) as RetrieveCount;

    if (retrieveInfo.relation === RelationType.AND) {
      return data.orderNum >= retrieveInfo.orderNum && data.paymentNum >= retrieveInfo.openPaymentNum;
    }

    if (retrieveInfo.relation === RelationType.OR) {
      return data.orderNum >= retrieveInfo.orderNum || data.paymentNum >= retrieveInfo.openPaymentNum;
    }

    return false;
  } catch {
    return false;
  }
}

export default function RetrieveModal({ skuInfo, onPay, onClose }: { skuInfo: SkuListItem; onPay: (skuInfo: SkuListItem) => void; onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  }

  const handlePay = () => {
    setIsOpen(false);
    onPay(skuInfo);
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/85"></div>
          <div className="relative z-10 w-full max-w-md mx-8">
            <div className="relative">
              <div onClick={handlePay}>
                <div
                  className="rounded-[24px] p-4 w-7/8 h-[80%] mx-auto absolute left-0 right-0 top-[-50px] z-0"
                  style={{
                    backgroundColor: '#dceefb',
                    minHeight: '120px',
                    backgroundImage: `
                    linear-gradient(45deg, #b8ddf5 25%, transparent 25%, transparent 75%, #b8ddf5 75%),
                    linear-gradient(45deg, #b8ddf5 25%, transparent 25%, transparent 75%, #b8ddf5 75%)
                  `,
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0, 15px 15px'
                  }}
                >
                </div>
                <div>
                  <img src="https://s03.bluearcshow.com/images/gift.png" alt="" className="absolute top-[-90px] right-[-10px] w-30 h-30 z-5" />
                  <div className="bg-gradient-to-r from-[#EAFF4C] to-[#23FFE2] rounded-full px-4 py-1 rotate-[10deg] inline-block text-black font-bold absolute top-[-50px] right-[80px] z-0 pr-8">
                    {t("retrieve.limited-time-offer")}
                  </div>
                </div>
                <div className="bg-white/30 backdrop-blur-md rounded-[24px] p-6 relative z-10">
                  <div className="py-4">
                    <div className="relative w-full mb-6">
                      <img src="https://s03.bluearcshow.com/images/alert-retrieve.png" alt="" className="w-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[18px] font-bold text-center text-black font-[Anton] whitespace-nowrap tracking-wider leading-tight">{t("retrieve.wait")}</div>
                      </div>
                    </div>
                    <div className="w-full h-[56px] bg-gradient-to-r from-[#3A4DFF] to-[#55A7FF] rounded-[18px] flex items-center px-2">
                      <span className="flex justify-between w-full items-center font-[Anton] whitespace-nowrap tracking-wider leading-tight px-4">
                        <span className="text-[16px] text-white italic">{t(`payment.${PeriodTypeToName[skuInfo.periodType as PeriodType]}-vip`)}</span>
                        <span className="text-[16px] text-white">
                          {skuInfo.currencySign}{skuInfo.firstPeriodPrice !== '0.00' ?
                            (String(skuInfo.firstPeriodPrice).endsWith('.00') ? String(skuInfo.firstPeriodPrice).slice(0, -3) : skuInfo.firstPeriodPrice) :
                            (String(skuInfo.price).endsWith('.00') ? String(skuInfo.price).slice(0, -3) : skuInfo.price)
                          }
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full h-[56px] bg-gradient-to-r from-[#3A4DFF] to-[#55A7FF] rounded-[16px] mt-4 text-[18px]" onClick={handlePay}>
                {t("retrieve.get-it-now")}
              </Button>
              <Link className="text-[14px] block text-center text-gray-500 mt-3 w-full" onClick={handleClose}>{t("retrieve.no-thanks")}</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
