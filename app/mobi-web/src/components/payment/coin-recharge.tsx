import { SkuImportant, SkuType } from '@lib/common/consts/sku';
import type { SkuListItem } from '@lib/common/dto/sku';

interface CoinRechargeProps {
  skuListRespState: {
    skuList?: SkuListItem[];
  };
  handleClickStoreCard: (skuInfo: SkuListItem) => void;
}

export default function CoinRecharge({ skuListRespState, handleClickStoreCard }: CoinRechargeProps) {
  return (
    <>
      {skuListRespState.skuList?.some((item) => (item.skuType === SkuType.Coin && item.isRetrieve === 0)) && (
        <h2 className="text-[16px] font-bold text-white tracking-wider">Coin Recharge</h2>
      )}
      <div className="flex flex-row gap-3 overflow-x-auto overflow-y-visible scrollbar-hide pt-3 overscroll-x-contain touch-pan-x" style={{ width: 'calc(100% + 2rem)', marginLeft: '-1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {skuListRespState.skuList?.map((item) => item.skuType === SkuType.Coin && (
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
        ))}
      </div>
    </>
  );
}