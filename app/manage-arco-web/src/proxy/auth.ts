import http from "./request";

type AuthLoginResp = {
  token: string;
}

export const auth = {
  async login(authInfo: { username: string, password: string }): Promise<string> {
    const result = await http.post<AuthLoginResp>("/api/auth/login", authInfo);
    return result.data.token;
  }
}
