import { useDeleteHistoryItem, useHistoryPage } from "@app/mobi-web/hooks/history/use-history-page";
import { CirclePlay, TrashBin } from "@gravity-ui/icons";
import { Button, Label, ProgressBar } from "@heroui/react";
import type { UserHistoryListReq } from "@lib/common/dto/history";
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const DELETE_BTN_WIDTH = 72;

export default function HistoryList() {
  const { t } = useTranslation('', { keyPrefix: 'history' });
  const { historyUserList, loading, hasMore, fetchHistoryList, fetchMore } = useHistoryPage();
  const { fetchDeleteHistoryItem } = useDeleteHistoryItem();

  const [historyListReq] = useState<UserHistoryListReq>({
    page: 1,
    size: 10,
  });

  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isDragging = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistoryList(historyListReq);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchMore]);

  const resetOpenItem = () => {
    if (openItemId) {
      const el = contentRefs.current[openItemId];
      if (el) el.style.transform = 'translateX(0)';
      setOpenItemId(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, itemId: string) => {
    // Close previously open item
    if (openItemId && openItemId !== itemId) resetOpenItem();
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = 0;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent, itemId: string) => {
    if (!isDragging.current) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchCurrentX.current;
    // Only allow left swipe
    if (diff > 0) {
      const el = contentRefs.current[itemId];
      if (el) {
        const translateX = Math.min(diff, DELETE_BTN_WIDTH);
        el.style.transform = `translateX(-${translateX}px)`;
      }
    }
  };

  const handleTouchEnd = (_e: React.TouchEvent, itemId: string) => {
    isDragging.current = false;
    const diff = touchStartX.current - touchCurrentX.current;
    const el = contentRefs.current[itemId];
    if (!el) return;

    if (diff > DELETE_BTN_WIDTH / 2) {
      el.style.transform = `translateX(-${DELETE_BTN_WIDTH}px)`;
      setOpenItemId(itemId);
    } else {
      el.style.transform = 'translateX(0)';
      setOpenItemId(null);
    }
  };

  const handleDelete = async (id: number) => {
    await fetchDeleteHistoryItem({ id });
    fetchHistoryList(historyListReq);
  };

  const handleContinue = async (collectionId: string, epNum: number) => {
    navigate(`/video/watch?collectionId=${collectionId}&episode=${epNum}`);
  };

  return (
    <div className="mx-4 pt-16 pb-4 ">
      {!historyUserList.list || historyUserList.list?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <img className="w-[160px] object-cover rounded-md shadow-sm rounded-[6px]" src="https://s01.bluearcshow.com/images/no-data.png" alt="No Data" />
          <span className="text-white text-[12px] mt-2">No Watch History</span>
        </div>
      ) : historyUserList.list?.map((item) => (
        <div key={item.collectionBizId} className="relative overflow-hidden rounded-[20px] mb-4">
          <button
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-red-500 text-white"
            style={{ width: DELETE_BTN_WIDTH }}
            onClick={() => handleDelete(item.id)}
          >
            <TrashBin className="size-5" />
          </button>

          <div
            ref={(el) => { contentRefs.current[item.collectionBizId] = el; }}
            className="relative bg-[#1c1c1c] p-4 flex gap-4 transition-transform duration-200"
            onTouchStart={(e) => handleTouchStart(e, item.collectionBizId)}
            onTouchMove={(e) => handleTouchMove(e, item.collectionBizId)}
            onTouchEnd={(e) => handleTouchEnd(e, item.collectionBizId)}
            onClick={openItemId ? resetOpenItem : undefined}
          >
            <img className="h-24 object-cover rounded-md shadow-sm rounded-[6px]" src={item.collectionCover} alt={item.collectionName} />
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-[14px] font-medium truncate">{item.collectionName}</h3>
              <ProgressBar aria-label={item.collectionBizId} size="sm" value={item.epNum / item.collectionEpNum * 100}>
                <Label>
                  <span className="text-white text-[10px] mt-1">{t('up-to', { epNum: item.epNum })}</span>
                  <span className="text-white/50 text-[10px] mt-1"> / {t('total', { totalEpNum: item.collectionEpNum })}</span>
                </Label>
                <ProgressBar.Track>
                  <ProgressBar.Fill className="bg-[#3D77FF]" />
                </ProgressBar.Track>
              </ProgressBar>
              <div className="flex justify-between mt-1 pt-2">
                <p className="text-white/50 text-[10px]">{t('watch-now')}</p>
                <Button size="sm" className="min-h-0 h-6 px-2 text-xs bg-white text-black" onClick={() => handleContinue(item.collectionBizId, item.epNum)}>
                  <CirclePlay />
                  {t('continue')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div ref={sentinelRef} className="flex justify-center py-4">
        { loading && <span className="text-white/50 text-xs">Loading...</span> }
      </div>
    </div>
  )
}
