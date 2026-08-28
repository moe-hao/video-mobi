import axios from "axios";
import { router } from "@/router";

export function searchParams(params: any): string {
  return new URLSearchParams(params).toString();
}

const http = axios.create({
  validateStatus: (status) => status >= 200 && status < 300,
  timeout: 30000,
});

http.interceptors.request.use((config) => {
  config.headers['content-type'] = 'application/json';
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `${token}`;
  }
  return config;
});

http.interceptors.response.use((response) => {
  if (response.status >= 200 && response.status < 300) {
    const data = response.data;
    if (data.code === 20002) {
      localStorage.removeItem("token");
      router.push("/user/login");
      return Promise.reject("登录已失效");
    }
    return data;
  }
});

export default http;
