import { UserType } from "@lib/common/consts/user";
import type { MemberInfoResp } from "@lib/common/dto/member";
import type { SubscriptionDetailResp } from "@lib/common/dto/subscription";
import type { UserAuthInfoResp } from "@lib/common/dto/user";
import { request } from "@lib/common/utils/request-mobi";
import { useState, useCallback } from "react";

type UserMemberInfoState = {
  expireTime: number;
}

export function useUserMemberInfo(): {
  userMemberInfoState: UserMemberInfoState;
  fetchUserMemberInfo: () => Promise<UserMemberInfoState>;
} {
  const [userMemberInfoState, setUserMemberInfoState] = useState<UserMemberInfoState>({
    expireTime: 0,
  });

  const fetchUserMemberInfo = useCallback(async () => {
    const memberInfo = await request<MemberInfoResp>('/api/member/info', 'GET');
    setUserMemberInfoState({ expireTime: memberInfo.expireTime });
    return memberInfo;
  }, []);

  return {
    userMemberInfoState,
    fetchUserMemberInfo,
  }
}

type UserInfoState = {
  user: UserAuthInfoResp;
  memberExpireTime: number;
  isLogin: boolean;
  isLoading: boolean;
  guestCode: string;
  userType: UserType;
}

export function useUserInfo(): {
  userInfoState: UserInfoState;
  fetchUserInfo: () => Promise<UserInfoState>;
} {
  const [userInfoState, setUserInfoState] = useState<UserInfoState>({
    user: {} as UserAuthInfoResp,
    memberExpireTime: 0,
    isLogin: false,
    isLoading: true,
    guestCode: '',
    userType: UserType.Guest,
  });

  const fetchUserInfo = useCallback(async () => {
    setUserInfoState(prev => ({ ...prev, isLoading: true }));
    try {
      let memberExpireTime = 0;
      const userInfo = await request<UserAuthInfoResp>('/api/auth/info', 'GET');
      if (userInfo.isLogin) {
        const memberInfo = await request<MemberInfoResp>('/api/member/info', 'GET');
        memberExpireTime = memberInfo.expireTime;
      }

      const userInfoState: UserInfoState = {
        user: userInfo,
        memberExpireTime: memberExpireTime,
        isLogin: userInfo.isLogin,
        isLoading: false,
        guestCode: userInfo.guestCode,
        userType: userInfo.userType,
      };
      setUserInfoState(userInfoState);
      return userInfoState;
    } catch (error) {
      setUserInfoState({ ...userInfoState, isLoading: false });
      return userInfoState;
    }
  }, []);

  return {
    userInfoState,
    fetchUserInfo,
  }
}

export function useUserSubscriptionInfo(): {
  userSubscriptionDetailState: SubscriptionDetailResp;
  fetchUserSubscriptionInfo: () => Promise<SubscriptionDetailResp>;
} {
  const [userSubscriptionDetailState, setUserSubscriptionDetailState] = useState<SubscriptionDetailResp>({} as SubscriptionDetailResp);

  const fetchUserSubscriptionInfo = useCallback(async () => {
    const result = await request<SubscriptionDetailResp>('/api/subscription/detail', 'GET');
    setUserSubscriptionDetailState(result);
    return result;
  }, []);

  return {
    userSubscriptionDetailState,
    fetchUserSubscriptionInfo,
  }
}
