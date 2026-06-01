import { useState } from "react";
import { request } from "@lib/common/utils/request-mobi";
import type { SendEmailCodeResp, VerifyEmailCodeReq } from "@lib/common/dto/email";
import type { UserAuthLoginResp } from "@lib/common/dto/user";

type UserLoginEmailState = {
  verifyCode: string;
}

export function useUserLoginEmail(): {
  userLoginEmailState: UserLoginEmailState;
  fetchUserLoginEmail: (email: string) => Promise<UserLoginEmailState>;
} {
  const [userLoginEmailState, setUserLoginEmailState] = useState<UserLoginEmailState>({
    verifyCode: '',
  });

  const fetchUserLoginEmail = async (email: string) => {
    const code = await request<SendEmailCodeResp>('/api/auth/send_email_code', 'POST', {
      email: email,
    })

    const loginStatus = {
      verifyCode: code.verifyCode,
    }

    setUserLoginEmailState(loginStatus)
    return loginStatus;
  }

  return {
    userLoginEmailState,
    fetchUserLoginEmail,
  }
}

export function userUserVerifyEmail(): {
  fetchUserVerifyEmail: (body: VerifyEmailCodeReq) => Promise<UserAuthLoginResp>;
} {
  const fetchUserVerifyEmail = async (body: VerifyEmailCodeReq) => {
    const result = await request<UserAuthLoginResp>('/api/auth/verify_email_code', 'POST', body);
    localStorage.setItem("auth", result.authToken);
    return result;
  }

  return {
    fetchUserVerifyEmail,
  }
}
