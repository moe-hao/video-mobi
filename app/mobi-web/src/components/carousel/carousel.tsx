import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import type { CollectionItemResp } from "@lib/common/dto/collection";

interface CarouselProps {
  items: CollectionItemResp[];
  onItemClick?: (bizId: string) => void;
  onIndexChange?: (index: number) => void;
}

export default function Carousel({ items, onItemClick, onIndexChange }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const maxSwipeDistance = 200;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
    setSwipeDelta(0);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(touchStartX.current - currentX);
      const deltaY = Math.abs(touchStartY.current - currentY);

      if (deltaX > deltaY && deltaX > 10) {
        isSwiping.current = true;
      }
    }

    if (isSwiping.current) {
      setIsDragging(true);
      setSwipeDelta(e.touches[0].clientX - touchStartX.current);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) {
      setIsDragging(false);
      setSwipeDelta(0);
      return;
    }

    setIsDragging(false);

    if (Math.abs(swipeDelta) < 50) {
      setSwipeDelta(0);
      return;
    }

    setSwipeDelta(0);
    if (swipeDelta < 0) {
      goToNext();
    } else {
      goToPrev();
    }
  };

  const getCardStyle = (offset: number) => {
    if (offset === 0) return { x: 0, scale: 1, opacity: 1, zIndex: 10 };
    if (offset === 1) return { x: 55, scale: 0.85, opacity: 0.5, zIndex: 5 };
    if (offset === items.length - 1) return { x: -55, scale: 0.85, opacity: 0.5, zIndex: 5 };
    return { x: 100, scale: 0.7, opacity: 0, zIndex: 0 };
  };

  if (items.length === 0) return null;

  const progress = Math.max(-1, Math.min(1, swipeDelta / maxSwipeDistance));

  return (
    <div
      className="relative w-full h-[260px] overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full flex items-center justify-center">
        {items.map((item, index) => {
          const offset = (index - currentIndex + items.length) % items.length;
          const currentStyle = getCardStyle(offset);

          let x = currentStyle.x;
          let scale = currentStyle.scale;
          let opacity = currentStyle.opacity;
          let zIndex = currentStyle.zIndex;

          if (isDragging && progress !== 0) {
            let targetOffset: number;
            if (progress < 0) {
              targetOffset = (offset - 1 + items.length) % items.length;
            } else {
              targetOffset = (offset + 1) % items.length;
            }
            const targetStyle = getCardStyle(targetOffset);
            const t = Math.abs(progress);
            x = currentStyle.x + (targetStyle.x - currentStyle.x) * t;
            scale = currentStyle.scale + (targetStyle.scale - currentStyle.scale) * t;
            opacity = currentStyle.opacity + (targetStyle.opacity - currentStyle.opacity) * t;
            zIndex = t > 0.3 ? targetStyle.zIndex : currentStyle.zIndex;
          }

          const transform = `translateX(${x}%) scale(${scale})`;

          return (
            <div
              key={item.bizId}
              className={`absolute h-60 aspect-[3/4] cursor-pointer ${isDragging ? "" : "transition-all duration-500 ease-out"}`}
              style={{
                transform,
                zIndex,
                opacity,
              }}
              onClick={() => !isDragging && offset === 0 && onItemClick?.(item.bizId)}
            >
              <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-[6px]">
                <img
                  src={item.cover}
                  alt={item.name}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-xs line-clamp-2">{item.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <button
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <ChevronRight />
      </button> */}
    </div>
  );
}

