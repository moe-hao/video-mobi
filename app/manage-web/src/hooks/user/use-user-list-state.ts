import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { UserListResp } from "@lib/common/dto/user";

export function useUserListState(): {
  userListState: UserListResp;
  fetchUserList: (page: number, size: number, search: string) => Promise<UserListResp>;
} {
  const [userListState, setUserListState] = useState<UserListResp>({} as UserListResp);

  const fetchUserList = useCallback(async (page: number = 1, size: number = 20, search: string = '') => {
    const userListResult = await request<UserListResp>(`/api/user/list?page=${page}&size=${size}&search=${search}`, 'GET');
    setUserListState(userListResult);
    return userListResult;
  }, []);

  return {
    userListState,
    fetchUserList,
  }
}
