import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router";
import Loading from "../loading";
import { changeLanguage } from "i18next";
import { useAuthCode } from "@app/mobi-web/hooks/user";
import type { UserAuthInfoResp } from "@lib/common/dto/user";
import { useProductInfo } from "@app/mobi-web/hooks/product";
import { VideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { ClockArrowRotateLeft, House, Person } from "@gravity-ui/icons";
import { useTranslation } from "react-i18next";
import { storeAdParam } from "./ad-param";

const bottomTabs = [
  { path: "/", label: "home", icon: <House /> },
  { path: "/history/list", label: "history", icon: <ClockArrowRotateLeft /> },
  { path: "/user/info", label: "profile", icon: <Person /> },
];

const showTabPath = ['/', '/history/list', '/user/info'];

export default function RouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInfoState, setUserInfoState] = useState<UserAuthInfoResp>();

  const { fetchUserInfo, fetchGuestLogin } = useAuthCode();
  const { productInfoState, fetchProductInfo } = useProductInfo();

  const fetchVideoMobiInfo = async () => {
    const auth = localStorage.getItem("auth");
    const code = searchParams.get('code') || '';

    if (!auth) {
      const result = await fetchGuestLogin(code);
      localStorage.setItem("auth", result.authToken);
    }

    const [userInfo, productInfo] = await Promise.all([
      fetchUserInfo(),
      fetchProductInfo(),
    ]);

    setUserInfoState(userInfo);
    changeLanguage(productInfo?.language || 'en');

    if (!code || code !== userInfo.guestCode) {
      searchParams.set('code', userInfo.guestCode);
      setSearchParams(searchParams);
    }

    storeAdParam(searchParams, setSearchParams);
  }

  useEffect(() => {
    fetchVideoMobiInfo();
  }, [location.pathname, searchParams]);

  const { t } = useTranslation('', { keyPrefix: 'navigation' });

  return (
    <VideoMobiContext.Provider value={{ userInfo: userInfoState, productInfo: productInfoState }}>
      <div className="flex flex-col flex-1">
        {showTabPath.includes(location.pathname) && (
          <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm bg-black/30 z-50 p-[12px] pl-4">
            <div className="flex items-center gap-2 p-[2px]">
              <img src="https://s03.bluearcshow.com/video_cover/logo-title-01.webp" alt="logo" width={100} height={22} />
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto pb-16">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
        {showTabPath.includes(location.pathname) && (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex w-full bg-black/80 backdrop-blur-sm">
            {bottomTabs.map((tab) => (
              <button
                key={tab.path}
                className={`flex-1 flex flex-col items-center gap-0.5 p-2 pb-3 bg-transparent border-none cursor-pointer ${location.pathname === tab.path ? 'text-[#3D77FF]' : 'text-white/60'}`}
                onClick={() => navigate(tab.path)}
              >
                <span className="[&>svg]:w-5 [&>svg]:h-5">{tab.icon}</span>
                <span className="text-[8px]">{t(tab.label)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </VideoMobiContext.Provider>
  );
}
