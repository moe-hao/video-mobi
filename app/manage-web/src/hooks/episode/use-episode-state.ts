import { useCallback, useState } from "react";
import type { CollectionAddReq, CollectionEditReq, CollectionPublishReq, CollectionTableListReq, CollectionTableListResp } from "@lib/common/dto/collection";
import { convertURLSearchParams } from "@lib/common/utils/param";
import http from "@lib/common/utils/http/manage";

export function useEpisodeState(): {
  episodeListState: CollectionTableListResp;
  fetchEpisodeList: (req: CollectionTableListReq) => Promise<CollectionTableListResp>;
} {
  const [episodeListState, setEpisodeListState] = useState<CollectionTableListResp>({} as CollectionTableListResp);

  const fetchEpisodeList = useCallback(async (req: CollectionTableListReq) => {
    const urlSearchParams = convertURLSearchParams(req)
    const resp = await http.get<CollectionTableListResp>(`/api/collection/list?${urlSearchParams}`);
    setEpisodeListState(resp.data);
    return resp.data;
  }, []);

  return {
    episodeListState,
    fetchEpisodeList,
  }
}

export function useCreateEpisodeState(): {
  fetchEpisodeAdd: (state: CollectionAddReq) => Promise<void>;
} {

  const fetchEpisodeAdd = useCallback(async (state: CollectionAddReq) => {
    await http.post(`/api/collection/add`, state);
  }, []);

  return {
    fetchEpisodeAdd,
  }
}

export function useEditEpisodeState(): {
  fetchEpisodeEdit: (state: CollectionEditReq) => Promise<void>;
} {

  const fetchEpisodeEdit = useCallback(async (state: CollectionEditReq) => {
    await http.post(`/api/collection/edit`, state);
  }, []);

  return {
    fetchEpisodeEdit,
  }
}


export function useDeleteEpisodeState(): {
  fetchEpisodeDelete: (id: number) => Promise<void>;
} {

  const fetchEpisodeDelete = useCallback(async (id: number) => {
    await http.post(`/api/collection/delete`, { id });
  }, []);

  return {
    fetchEpisodeDelete,
  }
}

export function useChangePublishState(): {
  fetchEpisodeChangePublish: (req: CollectionPublishReq) => Promise<void>;
} {
  const fetchEpisodeChangePublish = useCallback(async (req: CollectionPublishReq) => {
    await http.post(`/api/collection/update_publish_status`, req);
  }, []);

  return {
    fetchEpisodeChangePublish,
  }
}
