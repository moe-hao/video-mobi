import { useEffect } from "react";
import { ChevronRight, Person } from "@gravity-ui/icons";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { UserType } from "@lib/common/consts/user";
import { currentTime } from "@lib/common/utils/time";
import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { useUserMemberInfo, useUserSubscriptionInfo } from "@app/mobi-web/hooks/user";

export default function UserInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation('', { keyPrefix: 'user-info' });
  const { userInfo, productInfo } = useVideoMobiContext();
  const { userMemberInfoState, fetchUserMemberInfo } = useUserMemberInfo();
  const { fetchUserSubscriptionInfo } = useUserSubscriptionInfo();

  useEffect(() => {
    fetchUserMemberInfo();
    fetchUserSubscriptionInfo();
  }, [userInfo]);

  return (
    <div className='flex-1 bg-black overflow-auto'>
      {!userInfo ? (
        <div className="flex items-center justify-center pt-20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-1 items-center gap-4 min-w-0 pt-16 pb-8 p-4">
            <div className="rounded-full size-14 bg-white/10 flex items-center justify-center">
              <Person className="text-white" />
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <span className="text-base font-bold text-white truncate">{t('user')}</span>
              <span className="text-xs font-normal text-white truncate">UID: {userInfo.bizId}</span>
            </div>
            {userInfo.userType === UserType.Guest && (
              <button
                className="shrink-0 border-[1.5px] border-white/50 text-white bg-white/20 px-4 py-2 rounded-xl text-sm cursor-pointer"
                onClick={() => navigate('/user/login')}
              >
                {t('login-now')}
              </button>
            )}
          </div>

          <div className="rounded-[1.5rem] bg-gradient-to-b from-[#232323cc] to-black p-3 backdrop-blur-[10px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.3)]">
            <div className="flex flex-row gap-2 mb-4">
              <div className={`${productInfo?.coinUnlock ? 'w-2/3' : 'w-full'} bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] border-none rounded-[1.5rem] cursor-pointer`} onClick={() => navigate('/user/store')}>
                <div className="flex flex-row items-center justify-between gap-4 px-4 py-3">
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <h2 className="text-lg font-bold italic text-white truncate font-[Anton] tracking-wider">Blue Arc {t('premium')}</h2>
                      {
                        userMemberInfoState.expireTime > currentTime() ? (
                          <span className="text-[12px] text-white truncate">
                            {t('expiration-time')}: {new Date(userMemberInfoState.expireTime * 1000).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[12px] text-white truncate">{t('all-ep-free')}</span>
                        )
                      }
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              </div>
              {productInfo?.coinUnlock ? (
                <div className="w-1/3 bg-gradient-to-br from-[#FFC700] to-[#F89539] border-none rounded-[1.5rem] relative overflow-hidden cursor-pointer" onClick={() => navigate('/user/store')}>
                  <div className="flex flex-row items-center px-3 py-3">
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <h2 className="text-lg font-bold text-white tracking-wider">{userMemberInfoState.coinNum}</h2>
                        <img src="https://s03.bluearcshow.com/images/right-001.png" alt="icon" className="size-5" />
                      </div>
                    </div>
                  </div>
                  <img src="https://s03.bluearcshow.com/images/coin.png" alt="coin" className="absolute -bottom-0.5 right-1 size-13" />
                </div>
              ) : null}
            </div>
            <div className="w-full gap-1 py-4 px-2">
              {productInfo?.coinUnlock ? (
                <button className="w-full flex items-center gap-3 px-0 py-3 bg-transparent border-none cursor-pointer text-white" onClick={() => navigate('/user/coin')}>
                  <div className="flex items-start justify-center pt-px">
                    <img src="https://s03.bluearcshow.com/images/wallet.png" alt="wallet" className="size-6" />
                  </div>
                  <div className="flex flex-col flex-1 text-left text-sm">{t('coin-history')}</div>
                  <ChevronRight className="size-4 shrink-0 text-white/50" />
                </button>
              ) : null}
              <button className="w-full flex items-center gap-3 px-0 py-3 bg-transparent border-none cursor-pointer text-white" onClick={() => navigate('/user/feedback')}>
                <div className="flex items-start justify-center pt-px">
                  <img src="https://s03.bluearcshow.com/images/pencil.png" alt="feedback" className="size-6" />
                </div>
                <div className="flex flex-col flex-1 text-left text-sm">{t('feedback')}</div>
                <ChevronRight className="size-4 shrink-0 text-white/50" />
              </button>
              <button className="w-full flex items-center gap-3 px-0 py-3 bg-transparent border-none cursor-pointer text-white" onClick={() => { window.location.href = '/terms/terms-of-service.html'; }}>
                <div className="flex items-start justify-center pt-px">
                  <img src="https://s03.bluearcshow.com/images/terms.png" alt="terms" className="size-6" />
                </div>
                <div className="flex flex-col flex-1 text-left text-sm">{t('terms')}</div>
                <ChevronRight className="size-4 shrink-0 text-white/50" />
              </button>
              <button className="w-full flex items-center gap-3 px-0 py-3 bg-transparent border-none cursor-pointer text-white" onClick={() => { window.location.href = '/terms/privacy-policy.html'; }}>
                <div className="flex items-start justify-center pt-px">
                  <img src="https://s03.bluearcshow.com/images/privacy.png" alt="privacy" className="size-6" />
                </div>
                <div className="flex flex-col flex-1 text-left text-sm">{t('privacy')}</div>
                <ChevronRight className="size-4 shrink-0 text-white/50" />
              </button>
              {window.location.hostname === 'www.bluearcshow.com' && (
                <>
                  <button className="w-full flex items-center gap-3 px-0 py-3 bg-transparent border-none cursor-pointer text-white" onClick={() => { window.location.href = '/terms/about-us.html'; }}>
                    <div className="flex items-start justify-center pt-px">
                      <img src="https://s03.bluearcshow.com/images/terms.png" alt="about-us" className="size-6" />
                    </div>
                    <div className="flex flex-col flex-1 text-left text-sm">About Us</div>
                    <ChevronRight className="size-4 shrink-0 text-white/50" />
                  </button>
                  <button className="w-full flex items-center gap-3 px-0 py-3 bg-transparent border-none cursor-pointer text-white" onClick={() => { window.location.href = '/terms/contact-us.html'; }}>
                    <div className="flex items-start justify-center pt-px">
                      <img src="https://s03.bluearcshow.com/images/terms.png" alt="contact-us" className="size-6" />
                    </div>
                    <div className="flex flex-col flex-1 text-left text-sm">Contact Us</div>
                    <ChevronRight className="size-4 shrink-0 text-white/50" />
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


