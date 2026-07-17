import { Avatar, Button, Link } from "@heroui/react";
import { ArrowRightFromSquare, Gear } from '@gravity-ui/icons';
import { useLocation, useNavigate } from "react-router";
import Menu from "./components/menu";
import ViewRouter from "./routers";
import { useAuthCheck, AuthContext, useAuthLogout } from "./hooks/user";
import { ToastProvider } from "./contexts/toast-context";

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/user/login';
  const { user } = useAuthCheck();
  const { handleLogout } = useAuthLogout();
  const navigate = useNavigate();

  if (isLoginPage) {
    return <ToastProvider><ViewRouter /></ToastProvider>;
  }

  const handleLogoutButton = async () => {
    await handleLogout();
  }

  return (
    <ToastProvider>
      <AuthContext.Provider value={{ user }}>
        <div className="flex h-screen gray-100">
          <aside className="w-60 border-r border-gray-200 px-2 py-2 flex flex-col">
            <div className="text-lg font-bold text-center h-14 flex items-center justify-center">
              🌟 Red BlinBlin 后台管理
            </div>
            <div>
              <Menu accordion={false} />
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                <Avatar.Fallback> {user?.username.toUpperCase().charAt(0)}</Avatar.Fallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user?.username}</div>
                {/* <div className="text-gray-500 text-xs">{user?.email}</div> */}
              </div>
              <div className="text-sm text-gray-500 ml-auto">
                <Link onClick={() => navigate('/setting/info')}><Gear /></Link>
              </div>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="my-1">
              <Button variant="ghost" size="md" className="w-full justify-start text-md text-gray-500 font-normal" onClick={handleLogoutButton}>
                <ArrowRightFromSquare className="mr-2" />
                Logout
              </Button>
            </div>
          </aside>
          <main className="flex-1 h-screen p-6 overflow-auto">
            <ViewRouter />
          </main>
        </div>
      </AuthContext.Provider>
    </ToastProvider>
  );
}

