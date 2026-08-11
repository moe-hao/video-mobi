import { useTranslation } from 'react-i18next';
import { PeriodType, PeriodTypeToName } from '@lib/common/consts/subscription';
import { SkuImportant, SkuType } from '@lib/common/consts/sku';
import type { SkuListItem } from '@lib/common/dto/sku';

interface SubscriptionCardsProps {
  skuListRespState: {
    skuList?: SkuListItem[];
  };
  handleClickStoreCard: (skuInfo: SkuListItem) => void;
}

export default function SubscriptionCards({ skuListRespState, handleClickStoreCard }: SubscriptionCardsProps) {
  const { t } = useTranslation('', { keyPrefix: 'payment' });

  return (
    <div className="flex flex-col gap-5 w-full">
      {skuListRespState.skuList?.map((item) => (item.skuType === SkuType.Subscription && item.isRetrieve === 0) && (
        <div
          className={
            item.important === SkuImportant.Yes 
              ? "w-full bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] min-h-[70px] px-4 rounded-[16px] relative flex flex-col justify-center py-2" 
              : "w-full bg-white/10 backdrop-blur-sm border-white/20 min-h-[70px] px-4 rounded-[16px] relative flex flex-col justify-center py-2"
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
      ))}
    </div>
  );
}