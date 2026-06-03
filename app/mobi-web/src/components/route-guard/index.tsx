import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router";
import { Tabs } from "@heroui/react";
import Loading from "../loading";
import { changeLanguage } from "i18next";
import { useAuthCode } from "@app/mobi-web/hooks/user";
import type { UserAuthInfoResp } from "@lib/common/dto/user";
import { useProductInfo } from "@app/mobi-web/hooks/product";
import { VideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { House, Person } from "@gravity-ui/icons";

const bottomTabs = [
  { path: "/", label: "Home", icon: <House /> },
  // { path: "/test", label: "History", icon: <ClockArrowRotateLeft /> },
  { path: "/user/info", label: "Mine", icon: <Person /> },
];

const showTabPath = ['/', '/test', '/user/info'];

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
  }

  useEffect(() => {
    fetchVideoMobiInfo();
  }, [location.pathname, searchParams]);

  return (
    <VideoMobiContext.Provider value={{ userInfo: userInfoState, productInfo: productInfoState }}>
      <div className="flex flex-col flex-1">
        {showTabPath.includes(location.pathname) && (
          <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm bg-black/30 z-50 p-[12px] pl-4">
            <div className="flex items-center gap-2 p-[2px]">
              <img src="https://s01.bluearcshow.com/video_cover/logo-title-01.webp" alt="logo" width={100} height={22} />
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto pb-16">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
        {showTabPath.includes(location.pathname) && (
          <Tabs
          selectedKey={location.pathname}
          onSelectionChange={(key) => navigate(key as string)}
          className="fixed bottom-0 left-0 right-0 z-50 [&_[data-selected=true]]:text-[#3D77FF] [&_[data-selected=true]_svg]:text-[#3D77FF]"
        >
          <Tabs.List aria-label="导航" className="w-full rounded-none">
            {bottomTabs.map((tab) => (
              <Tabs.Tab key={tab.path} id={tab.path} className="flex-col gap-0.5 p-5 pb-6">
                <span className="[&>svg]:w-5 [&>svg]:h-5">{tab.icon}</span>
                <span className="text-[8px]">{tab.label}</span>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
        )}
      </div>
    </VideoMobiContext.Provider>
  );
}
