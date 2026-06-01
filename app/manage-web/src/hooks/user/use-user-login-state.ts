import type { AdminLoginResp } from "@lib/common/dto/admin";
import { request } from "@lib/common/utils/request-manage";
import { useCallback } from "react";

export function useUserLoginState(): {
  fetchUserLogin: (username: string, password: string) => Promise<void>;
} {
  const fetchUserLogin = useCallback(async (username: string, password: string) => {
    const authInfo = await request<AdminLoginResp>(`/api/auth/login`, 'POST', { username, password });
    localStorage.setItem('token', authInfo.token);
  }, []);

  return {
    fetchUserLogin,
  }
}
