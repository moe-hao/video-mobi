import type { UserAuthInfoResp, UserAuthLoginResp } from "@lib/common/dto/user";
import { request } from "@lib/common/utils/request-mobi";
import { useCallback, useState } from "react"

type userAuthState = {
  infoResp: UserAuthInfoResp;
  loginResp: UserAuthLoginResp;
}

export function useAuthCode(): {
  userAuthState: userAuthState;
  fetchUserInfo: () => Promise<UserAuthInfoResp>,
  fetchGuestLogin: (code: string) => Promise<UserAuthLoginResp>
} {
  const [userAuthState, setUserAuthState] = useState<userAuthState>({
    infoResp: {} as UserAuthInfoResp,
    loginResp: {} as UserAuthLoginResp,
  });

  const fetchUserInfo = useCallback(async () => {
    const result = await request<UserAuthInfoResp>('/api/auth/info', 'GET');
    setUserAuthState({
      ...userAuthState,
      infoResp: result,
    });
    return result;
  }, []);

  const fetchGuestLogin = useCallback(async (code: string) => {
    const result = await request<UserAuthLoginResp>('/api/auth/guest_login', 'POST', { code });
    setUserAuthState({
      ...userAuthState,
      loginResp: result,
    });
    return result;
  }, []);

  return { userAuthState, fetchUserInfo, fetchGuestLogin };
}
