import { useCallback, useState } from "react";
import type { UserListResp } from "@lib/common/dto/user";
import http from "@lib/common/utils/http/manage";

export function useUserListState(): {
  userListState: UserListResp;
  fetchUserList: (page: number, size: number, search: string) => Promise<UserListResp>;
} {
  const [userListState, setUserListState] = useState<UserListResp>({} as UserListResp);

  const fetchUserList = useCallback(async (page: number = 1, size: number = 20, search: string = '') => {
    const resp = await http.get<UserListResp>(`/api/user/list?page=${page}&size=${size}&search=${search}`);
    setUserListState(resp.data);
    return resp.data;
  }, []);

  return {
    userListState,
    fetchUserList,
  }
}
