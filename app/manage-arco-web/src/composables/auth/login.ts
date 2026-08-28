import { auth } from "@/proxy/auth";

export async function login(authInfo: { username: string, password: string }) {
  try {
    const token = await auth.login(authInfo);
    localStorage.setItem("token", token);
  } catch (err) {
    console.error("登录失败:", err);
  }
}
