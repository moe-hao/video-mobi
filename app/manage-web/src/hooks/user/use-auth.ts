import { useNavigate } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { AdminInfoResp } from "@lib/common/dto/admin";

interface AuthContextType {
  user: AdminInfoResp | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

export function useAuthCheck() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminInfoResp | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await request<AdminInfoResp>(`/api/auth/info`, 'GET');
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
      } catch {
        localStorage.removeItem('user');
        navigate('/user/login');
      }
    };
    checkAuth();
  }, [navigate]);

  return { user };
}

export function useAuthLogout(): {
  handleLogout: () => Promise<void>;
} {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await request(`/api/auth/logout`, 'POST');
    localStorage.removeItem('token');
    navigate('/user/login');
  }
  return { handleLogout };
}

export function useChangePassword(): {
  fetchChangePassword: (oldPassword: string, newPassword: string) => Promise<void>;
} {
  const fetchChangePassword = async (oldPassword: string, newPassword: string) => {
    await request(`/api/auth/change_password`, 'POST', {
      oldPassword,
      newPassword,
    });
  }
  return { fetchChangePassword };
}
