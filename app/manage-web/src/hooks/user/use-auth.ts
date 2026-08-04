import { useLocation, useNavigate } from "react-router";
import { useEffect, useState, createContext, useContext } from "react";
import type { AdminInfoResp } from "@lib/common/dto/admin";
import http from "@lib/common/utils/http/manage";

interface AuthContextType {
  user: AdminInfoResp | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

export function useAuthCheck() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AdminInfoResp | null>(null);

  useEffect(() => {
    if (location.pathname === '/user/login') {
      return;
    }

    const checkAuth = async () => {
      try {
        const resp = await http.get<AdminInfoResp>(`/api/auth/info`);
        setUser(resp.data);
        localStorage.setItem('user', JSON.stringify(resp.data));
      } catch {
        localStorage.removeItem('user');
        navigate('/user/login');
      }
    };
    checkAuth();
  }, [navigate, location.pathname]);

  return { user };
}

export function useAuthLogout(): {
  handleLogout: () => Promise<void>;
} {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await http.post(`/api/auth/logout`);
    localStorage.removeItem('token');
    navigate('/user/login');
  }
  return { handleLogout };
}

export function useChangePassword(): {
  fetchChangePassword: (oldPassword: string, newPassword: string) => Promise<void>;
} {
  const fetchChangePassword = async (oldPassword: string, newPassword: string) => {
    await http.post(`/api/auth/change_password`, {
      oldPassword,
      newPassword,
    });
  }
  return { fetchChangePassword };
}
