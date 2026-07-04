import { UserType } from "@lib/common/consts/user";
import type { MemberInfoResp } from "@lib/common/dto/member";
import type { SubscriptionDetailResp } from "@lib/common/dto/subscription";
import type { UserAuthInfoResp, UserCoinHistoryReq, UserCoinHistoryResp } from "@lib/common/dto/user";
import { convertURLSearchParams } from "@lib/common/utils/param";
import { request } from "@lib/common/utils/request-mobi";
import { useState, useCallback } from "react";

type UserMemberInfoState = {
  expireTime: number;
  coinNum: number;
}

export function useUserMemberInfo(): {
  userMemberInfoState: UserMemberInfoState;
  fetchUserMemberInfo: () => Promise<UserMemberInfoState>;
} {
  const [userMemberInfoState, setUserMemberInfoState] = useState<UserMemberInfoState>({
    expireTime: 0,
    coinNum: 0,
  });

  const fetchUserMemberInfo = useCallback(async () => {
    const memberInfo = await request<MemberInfoResp>('/api/member/info', 'GET');
    setUserMemberInfoState({ expireTime: memberInfo.expireTime, coinNum: memberInfo.coinNum });
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

export function userUserCoinList(): {
  userCoinListState: UserCoinHistoryResp;
  fetchUserCoinList: (req: UserCoinHistoryReq) => Promise<UserCoinHistoryResp>;
  loadMoreUserCoinList: (req: UserCoinHistoryReq) => Promise<UserCoinHistoryResp>;
  hasMore: boolean;
  loadingMore: boolean;
} {
  const [userCoinListState, setUserCoinListState] = useState<UserCoinHistoryResp>({} as UserCoinHistoryResp);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchUserCoinList = useCallback(async (req: UserCoinHistoryReq) => {
    const result = await request<UserCoinHistoryResp>(`/api/member/coin_history?${convertURLSearchParams(req)}`, 'GET');
    setUserCoinListState(result);
    setHasMore(result.page * result.size < result.total);
    return result;
  }, []);

  const loadMoreUserCoinList = useCallback(async (req: UserCoinHistoryReq) => {
    setLoadingMore(true);
    const result = await request<UserCoinHistoryResp>(`/api/member/coin_history?${convertURLSearchParams(req)}`, 'GET');
    setUserCoinListState(prev => ({
      ...result,
      list: [...(prev.list || []), ...result.list],
    }));
    setHasMore(result.page * result.size < result.total);
    setLoadingMore(false);
    return result;
  }, []);

  return {
    userCoinListState,
    fetchUserCoinList,
    loadMoreUserCoinList,
    hasMore,
    loadingMore,
  }
}
