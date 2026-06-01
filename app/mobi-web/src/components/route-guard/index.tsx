import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router";
import Loading from "../loading";
import { changeLanguage } from "i18next";
import { useAuthCode } from "@app/mobi-web/hooks/user";
import type { UserAuthInfoResp } from "@lib/common/dto/user";
import { useProductInfo } from "@app/mobi-web/hooks/product";
import { VideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";

export default function RouteGuard() {
    const location = useLocation();
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
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </VideoMobiContext.Provider>
    );
}
