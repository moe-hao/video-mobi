import type { AdminLoginResp } from "@lib/common/dto/admin";
import http from "@lib/common/utils/http/manage";
import { useCallback } from "react";

export function useUserLoginState(): {
  fetchUserLogin: (username: string, password: string) => Promise<void>;
} {
  const fetchUserLogin = useCallback(async (username: string, password: string) => {
    const resp = await http.post<AdminLoginResp>(`/api/auth/login`, { username, password });
    localStorage.setItem('token', resp.data.token);
  }, []);

  return {
    fetchUserLogin,
  }
}
