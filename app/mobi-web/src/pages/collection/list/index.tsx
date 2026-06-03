import { Card } from '@heroui/react';
import { useEffect, useRef, useCallback, useState } from 'react';
import { CircleDashed, CircleCheckFill } from '@gravity-ui/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCollection, useFeatureCollection } from '@app/mobi-web/hooks/collection';
import Carousel from '@app/mobi-web/components/carousel';

export default function CollectionListPage() {
  const { t } = useTranslation('', {keyPrefix: 'collection-list'});
  const navigate = useNavigate();

  const { collectionListResp, fetchCollectionList, loadMore, loading, hasMore } = useCollection();
  const { featuredList, fetchFeaturedCollections } = useFeatureCollection();
  const observerRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    fetchCollectionList(1);
    fetchFeaturedCollections();
  }, [fetchCollectionList, fetchFeaturedCollections]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleVideoClick = (bizId: string) => {
    navigate(`/video/watch?collectionId=${bizId}&episode=1`);
  };

  return (
    <div className='flex-1 bg-black overflow-auto'>
      <div>
        {featuredList.length > 0 && (
          <div className="relative my-1 -mx-4 pt-10 pb-4 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center blur-md transition-all duration-700"
              style={{
                backgroundImage: `
                  linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 15%, transparent 55%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,1) 90%),
                  linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(61,119,255,0.35) 35%, transparent 50%, rgba(61,119,255,0.35) 65%, rgba(0,0,0,0.7) 100%),
                  url(${featuredList[carouselIndex]?.cover})
                `,
              }}
            />
            <div className="relative z-10">
              <Carousel items={featuredList} onItemClick={handleVideoClick} onIndexChange={setCarouselIndex} />
            </div>
          </div>
        )}
        <h1 className="text-lg font-bold text-white p-2">{t('all-collections')}</h1>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 p-2">
          {collectionListResp?.list?.map((collection) => (
            <div
              key={collection.bizId}
              onClick={() => handleVideoClick(collection.bizId)}
              className="cursor-pointer"
            >
              <Card className="aspect-[3/4] relative">
                <img
                  alt={collection.name}
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover rounded-[6px]"
                  src={collection.cover}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <Card.Footer className="z-10 absolute bottom-0 right-0 p-2 justify-end">
                  <div className="text-xs text-white">{collection.episodes} {t('episodes')}</div>
                </Card.Footer>
              </Card>
              <p className="text-xs line-clamp-2 mt-1">{collection.name}</p>
            </div>
          ))}
        </div>
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {loading && (
            <span className="text-white text-sm animate-spin">
              <CircleDashed />
            </span>
          )}
          {!hasMore && collectionListResp?.list?.length > 0 && (
            <span className="text-white/50 text-xl">
              <CircleCheckFill />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
