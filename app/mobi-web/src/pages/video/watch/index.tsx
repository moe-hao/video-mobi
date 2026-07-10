import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Badge, Button } from '@heroui/react';
import { ArrowShapeTurnUpRight, ChevronLeft, Heart, HeartFill, LockFill, PlayFill, TextAlignJustify, Video } from '@gravity-ui/icons';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '@app/mobi-web/components/loading';
import Payment from '@app/mobi-web/components/payment';
import { useCollectionVideo, useLike, useLikeStatus, useUnlockCoin } from '@app/mobi-web/hooks/video';
import { useToast } from '@app/mobi-web/contexts/toast-context';

export default function VideoWatch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation('', { keyPrefix: 'video-with-id' });

  const collectionId = searchParams.get('collectionId') || '';
  const episode = parseInt(searchParams.get('episode') || '1');
  const toastQueue = useToast();

  const { videoPlayInfoResp, fetchVideoPlayInfo } = useCollectionVideo();
  const { fetchLike } = useLike();
  const { likeResp, fetchLikeStatus } = useLikeStatus();
  const { fetchUnlockCoin } = useUnlockCoin();

  const [currentURL, setCurrentURL] = useState('');
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [_videoReady, setVideoReady] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [episodePage, setEpisodePage] = useState(0);
  const [modalOffsetY, setModalOffsetY] = useState(0);
  const modalTouchStartY = useRef(0);
  const modalTouchOffsetY = useRef(0);

  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const episodeModalRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);
  const isSwiping = useRef(false);
  const isModalSwipingDown = useRef(false);
  const shouldPreventClick = useRef(false);

  const collectionVideoEpisodes = videoPlayInfoResp.videoList?.map((item) => item.epNum) || [];
  const maxEpisode = Math.max(...collectionVideoEpisodes, 0);
  const minEpisode = Math.min(...collectionVideoEpisodes, 1);

  const changeEpisode = (newEpisode: number) => {
    if (newEpisode >= minEpisode && newEpisode <= maxEpisode) {
      setCurrentURL('');
      setCurrentEpisode(newEpisode);
      setVideoLoading(true);
      navigate(`/video/watch?collectionId=${collectionId}&episode=${newEpisode}`, { replace: true });
      setCurrentTime(0);
    }
  };

  const player = useRef<HTMLVideoElement>(null);
  const [isPlay, setIsPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setCurrentURL(videoPlayInfoResp.playURL || '');
  }, [videoPlayInfoResp.playURL]);

  useEffect(() => {
    fetchVideoPlayInfo(collectionId, currentEpisode);
    fetchLikeStatus({ collectionBizId: collectionId });
  }, [fetchVideoPlayInfo, fetchLikeStatus, collectionId, currentEpisode]);

  useEffect(() => {
    const currentVideo = videoPlayInfoResp.videoList?.find((item) => item.epNum === currentEpisode);
    if (currentVideo?.isLock) {
      setIsUnlockModalOpen(true);
    }
  }, [videoPlayInfoResp.videoList, currentEpisode]);

  useEffect(() => {
    const video = player.current;
    if (!video || !videoPlayInfoResp.videoList) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoReady(true);
    };

    const handleCanPlay = () => {
      setVideoLoading(false);
    };

    const handleWaiting = () => {
      setVideoLoading(true);
    };

    const handlePlaying = () => {
      setVideoLoading(false);
      setIsPlay(true);
    };

    const handlePause = () => {
      setIsPlay(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    };

    const handleEnded = () => {
      if (currentEpisode < maxEpisode) {
        const nextVideo = videoPlayInfoResp.videoList?.find((item) => item.epNum === currentEpisode + 1);
        if (!nextVideo?.isLock) {
          applyTransform(-window.innerHeight, true);
          setTimeout(() => {
            changeEpisode(currentEpisode + 1);
          }, 200);
        } else {
          changeEpisode(currentEpisode + 1);
          setIsUnlockModalOpen(true);
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch(() => {
      setVideoLoading(false);
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoPlayInfoResp.videoList, currentEpisode, maxEpisode, currentURL]);

  useEffect(() => {
    const el = swipeContainerRef.current;
    if (el) {
      el.style.transition = 'none';
      el.style.transform = 'translateY(0px)';
    }
  }, [currentEpisode]);

  useEffect(() => {
    const el = swipeContainerRef.current;
    if (!el) return;

    const preventTouchMove = (e: TouchEvent) => {
      if (isSwiping.current && e.cancelable) {
        e.preventDefault();
      }
    };

    el.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      el.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  useEffect(() => {
    const el = episodeModalRef.current;
    if (!el) return;

    const preventPullRefresh = (e: TouchEvent) => {
      if (isModalSwipingDown.current && e.cancelable) {
        e.preventDefault();
      }
    };

    el.addEventListener('touchmove', preventPullRefresh, { passive: false });

    return () => {
      el.removeEventListener('touchmove', preventPullRefresh);
    };
  }, [isEpisodeModalOpen]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (player.current) {
      player.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = async () => {
    if (shouldPreventClick.current) {
      shouldPreventClick.current = false;
      return;
    }
    if (player.current?.paused) {
      await navigator.wakeLock?.request('screen')
      player.current.play();
      setIsPlay(true);
    } else {
      player.current?.pause();
      setIsPlay(false);
    }
  };

  const handleEpisodeButton = (episode: number, isLock: boolean) => {
    if (isLock) {
      fetchUnlockCoin({ collectionBizId: collectionId, epNum: episode }).then(async (result) => {
        if (result.status === 'success') {
          await fetchVideoPlayInfo(collectionId, currentEpisode);
          changeEpisode(episode);
        } else if (result.status === 'invalid_unlock') {
          toastQueue.add({
            title: "Please unlock previous episodes first",
            variant: "warning",
            timeout: 2000,
          });
        } else {
          setIsUnlockModalOpen(true);
        }
      });
    } else {
      changeEpisode(episode);
    }
    setIsEpisodeModalOpen(false);
  };


  const swipeThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.2 : 200;

  const applyTransform = (offset: number, animated: boolean) => {
    const el = swipeContainerRef.current;
    if (!el) return;
    el.style.transition = animated ? 'transform 0.2s ease-out' : 'none';
    el.style.transform = `translateY(${offset}px)`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    isSwiping.current = false;
    shouldPreventClick.current = false;
    setIsTransitioning(false);
    applyTransform(0, false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    touchCurrentY.current = e.touches[0].clientY;
    const diff = touchCurrentY.current - touchStartY.current;

    if (!isSwiping.current && Math.abs(diff) > 10) {
      isSwiping.current = true;
      shouldPreventClick.current = true;
    }

    if (isSwiping.current) {
      applyTransform(diff, false);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) {
      applyTransform(0, false);
      return;
    }

    const diff = touchCurrentY.current - touchStartY.current;
    setIsTransitioning(true);

    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0 && currentEpisode < maxEpisode) {
        const nextVideo = videoPlayInfoResp.videoList?.find((item) => item.epNum === currentEpisode + 1);
        if (nextVideo?.isLock) {
          applyTransform(0, true);
          fetchUnlockCoin({ collectionBizId: collectionId, epNum: currentEpisode + 1 }).then(async (result) => {
            if (result.status === 'success') {
              await fetchVideoPlayInfo(collectionId, currentEpisode);
              applyTransform(-window.innerHeight, true);
              setTimeout(() => {
                changeEpisode(currentEpisode + 1);
                setIsTransitioning(false);
              }, 200);
            } else if (result.status === 'invalid_unlock') {
              toastQueue.add({
                title: t('unlock-toast'),
                variant: "warning",
                timeout: 2000,
              });
              applyTransform(0, true);
              setIsTransitioning(false);
            } else {
              applyTransform(0, true);
              setIsUnlockModalOpen(true);
              setIsTransitioning(false);
            }
          });
        } else {
          applyTransform(-window.innerHeight, true);
          setTimeout(() => {
            changeEpisode(currentEpisode + 1);
            setIsTransitioning(false);
          }, 200);
        }
      } else if (diff > 0 && currentEpisode > minEpisode) {
        const prevVideo = videoPlayInfoResp.videoList?.find((item) => item.epNum === currentEpisode - 1);
        if (prevVideo?.isLock) {
          applyTransform(0, true);
          setTimeout(() => {
            setIsUnlockModalOpen(true);
            setIsTransitioning(false);
          }, 200);
        } else {
          applyTransform(window.innerHeight, true);
          setTimeout(() => {
            changeEpisode(currentEpisode - 1);
            setIsTransitioning(false);
          }, 200);
        }
      } else {
        applyTransform(0, true);
        setTimeout(() => setIsTransitioning(false), 200);
      }
    } else {
      applyTransform(0, true);
      setTimeout(() => setIsTransitioning(false), 200);
    }

    isSwiping.current = false;
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  };

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={swipeContainerRef} className="absolute inset-0 touch-none">
        <div className="absolute inset-0" onClick={handleTogglePlay}>
          {currentURL && (
            <video
              key={currentEpisode}
              ref={player}
              src={currentURL}
              disablePictureInPicture
              controlsList="nodownload noremoteplayback"
              className="w-full h-full object-contain select-none [-webkit-user-drag:none] [-webkit-touch-callout:none]"
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
              playsInline
            />
          )}
        </div>
      </div>
      {(!videoLoading && currentURL) ? (
        !isPlay && (
          <Button
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            onPress={handleTogglePlay}
          >
            <PlayFill className="text-2xl" />
          </Button>
        )
      ) : (
        <Loading />
      )}

      <div
        className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-b from-black/70 to-transparent"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onPress={() => navigate('/')}>
            <ChevronLeft />
          </Button>
          <h2 className="text-md font-bold">{t('episode-num', { currentEpisode })}</h2>
        </div>

      </div>
      <div
        className="fixed right-0 top-2/3 -translate-y-1/2 z-30"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <button
          className="flex flex-col items-center p-2 m-1 bg-transparent border-none cursor-pointer w-16"
          onClick={async () => {
            await fetchLike({ collectionBizId: collectionId });
            await fetchLikeStatus({ collectionBizId: collectionId });
          }}
        >
          {likeResp.isLike ? (
            <HeartFill width={28} height={28} className="text-white" />
          ) : (
            <Heart width={28} height={28} className="text-white" />
          )}
          <span className="text-white mt-1" style={{ fontSize: 10 }}>{likeResp.likeTotal}</span>
        </button>
        <button
          className="flex flex-col items-center p-2 m-1 bg-transparent border-none cursor-pointer w-16"
          onClick={() => setIsEpisodeModalOpen(true)}
        >
          <TextAlignJustify width={28} height={28} className="text-white" />
          <span className="text-white mt-1" style={{ fontSize: 10 }}>{t('episode-select')}</span>
        </button>
        <button
          className="flex flex-col items-center p-2 m-1 bg-transparent border-none cursor-pointer w-16"
          onClick={() => {
            const url = `${window.location.origin}${window.location.pathname}?collectionId=${collectionId}&episode=${currentEpisode}`;
            navigator.clipboard.writeText(url);
            toastQueue.add({
              title: "Copy URL Success!",
              variant: "success",
              timeout: 1000,
            })
          }}
        >
          <ArrowShapeTurnUpRight width={28} height={28} className="text-white" />
          <span className="text-white mt-1" style={{ fontSize: 10 }}>{t('share')}</span>
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-b from-black/0 to-black/100"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <h2 className="text-md font-bold">{videoPlayInfoResp.collectionName}</h2>
        <div className="flex items-center gap-2">
          <Video />
          <h2 className="text-sm">{t('completed')} | {t('total-episodes', { totalEpisodes: videoPlayInfoResp.collectionEpisodes })}</h2>
        </div>
        <div className="mb-4 text-white">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {isEpisodeModalOpen && (
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsEpisodeModalOpen(false)}
          />
          <div
            ref={episodeModalRef}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white rounded-t-3xl p-4 z-50 overflow-y-auto max-h-[70vh]"
            style={{
              animation: 'slideUp 0.3s ease-out',
              transform: `translateY(${modalOffsetY}px)`,
              transition: modalOffsetY === 0 ? 'transform 0.2s ease-out' : 'none',
            }}
            onTouchStart={(e) => {
              modalTouchStartY.current = e.touches[0].clientY;
              modalTouchOffsetY.current = modalOffsetY;
            }}
            onTouchMove={(e) => {
              const deltaY = e.touches[0].clientY - modalTouchStartY.current;
              if (deltaY > 0) {
                isModalSwipingDown.current = true;
                setModalOffsetY(modalTouchOffsetY.current + deltaY);
              } else {
                isModalSwipingDown.current = false;
              }
            }}
            onTouchEnd={(e) => {
              isModalSwipingDown.current = false;
              const deltaY = e.changedTouches[0].clientY - modalTouchStartY.current;
              if (deltaY > 80) {
                setIsEpisodeModalOpen(false);
                setModalOffsetY(0);
              } else {
                setModalOffsetY(0);
              }
            }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-white/40 rounded-full" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium">{videoPlayInfoResp.collectionName}</h3>
            </div>
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">{t('episode-select')}</h4>
            </div>
            <div className="mt-1 mb-4">
              {Array.from({ length: Math.ceil((videoPlayInfoResp.videoList?.length || 0) / 25) }).map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={i === episodePage ? "primary" : "ghost"}
                  className={i === episodePage ? "min-w-8 h-8 bg-[#3D77FF]" : "min-w-8 h-8 text-white/60"}
                  onPress={() => setEpisodePage(i)}
                >
                  {`${i * 25 + 1}-${Math.min((i + 1) * 25, videoPlayInfoResp.videoList?.length || 0)}`}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-5">
              {videoPlayInfoResp.videoList?.slice(episodePage * 25, (episodePage + 1) * 25).map((video) => (
                <div className="flex justify-center mb-4" key={video.epNum}>
                  <Badge.Anchor key={video.epNum} className="w-10 h-10 flex items-center justify-center">
                    <Avatar className="w-12 h-12 rounded-lg">
                      <Avatar.Fallback
                        className={video.epNum === currentEpisode ? "w-12 h-12 rounded-lg bg-[#3D77FF]" : "w-12 h-12 rounded-lg border-white/30 text-white bg-transparent"}
                        onClick={() => handleEpisodeButton(video.epNum, video.isLock)}
                      >
                        {video.epNum}
                      </Avatar.Fallback>
                    </Avatar>
                    {video.isLock && (
                      <Badge color="accent" size="sm" placement="top-right" className="w-3 h-3 bg-[#3D77FF]">
                        <LockFill className="w-2 h-2" />
                      </Badge>
                    )}
                  </Badge.Anchor>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isUnlockModalOpen && (
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsUnlockModalOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white rounded-t-2xl p-4 z-50 overflow-y-auto"
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div className="flex justify-center items-center">
              <span className="text-[32px] font-[Anton] bg-gradient-to-r from-[#3A4DFF] to-[#55A7FF] bg-clip-text text-transparent">Blue Arc</span>&nbsp;<span className="text-[32px] font-[Anton]">Preminum</span>
            </div>
            <div className="flex justify-center items-center mb-4">
              <span className="text-[12px]">Activate to enjoy more benefits</span>
            </div>
            <Payment />
          </div>
        </div>
      )}
    </div>
  );
}
