import { userUserCoinList } from "@app/mobi-web/hooks/user";
import { ChevronLeft } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { UnlockCommType } from "@lib/common/consts/unlock-coin";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const PAGE_SIZE = 10;

export default function Coin() {
  const navigate = useNavigate();
  const { t } = useTranslation('', {keyPrefix: 'coin-history'});

  const { userCoinListState, fetchUserCoinList, loadMoreUserCoinList, hasMore, loadingMore } = userUserCoinList();
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserCoinList({ page: 1, size: PAGE_SIZE });
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && userCoinListState.list?.length > 0) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadMoreUserCoinList({ page: nextPage, size: PAGE_SIZE });
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, userCoinListState.list?.length]);

  return (
    <div className="h-full -mb-16">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate("/user/info")}>
          <ChevronLeft />
        </Button>
        <h1 className="text-lg text-white">{t("title")}</h1>
        <div className="w-10" />
      </div>

      <div className="pt-16 p-4">
        {userCoinListState?.list?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <img
              className="w-[160px] object-cover rounded-md shadow-sm rounded-[6px]"
              src="https://s01.bluearcshow.com/images/no-data.png"
              alt="No Data"
            />
            <span className="text-white text-[12px] mt-2">No Coin History</span>
          </div>
        ) : (
          userCoinListState?.list?.map((item, index) => (
            <div key={index} className="bg-[#1c1c1c] p-4 flex gap-4 rounded-[20px] mb-4">
              <img
                className="size-8 object-cover rounded-md shrink-0"
                src="https://i.bluearcshow.com/images/coin-img.png"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white text-[14px] font-medium">{item.commType === UnlockCommType.Charge ? t("received") : t("spent")}</h3>
                    <p className="text-white/50 text-[10px] mt-0.5">{item.createTime}</p>
                  </div>
                  <span className="text-[14px] font-medium shrink-0">
                    {item.commType === UnlockCommType.Charge ? "+" : "-"}
                    {item.coinNum}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        <div ref={sentinelRef} className="flex justify-center py-4">
          {loadingMore && <span className="text-white/50 text-sm">Loading...</span>}
        </div>
      </div>
    </div>
  );
}
