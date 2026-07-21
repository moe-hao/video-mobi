import { useUserLoginState } from "@app/manage-web/hooks/user";
import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function UserLogin() {
  const { fetchUserLogin } = useUserLoginState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    await fetchUserLogin(username, password);
    navigate('/dashboard/view');
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/5 bg-gradient-to-br from-slate-700 to-slate-900 items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Red BlinBlin</h1>
          <h1 className="text-3xl font-bold mb-4">后台管理工具</h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-8">
          <div className="bg-white p-8 rounded-xl shadow-lg lg:w-120">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">管理后台用户登录</h2>
            <div className="space-y-4">
              <Input
                variant="secondary"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                variant="secondary"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <Button variant="primary" className="w-full mt-2" size="lg" onClick={handleLogin}>登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
