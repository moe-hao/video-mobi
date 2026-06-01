import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import type { CollectionAddReq, CollectionEditReq, CollectionPublishReq, CollectionTableListReq, CollectionTableListResp } from "@lib/common/dto/collection";
import { convertURLSearchParams } from "@lib/common/utils/param";

export function useEpisodeState(): {
  episodeListState: CollectionTableListResp;
  fetchEpisodeList: (req: CollectionTableListReq) => Promise<CollectionTableListResp>;
} {
  const [episodeListState, setEpisodeListState] = useState<CollectionTableListResp>({} as CollectionTableListResp);

  const fetchEpisodeList = useCallback(async (req: CollectionTableListReq) => {
    const urlSearchParams = convertURLSearchParams(req)
    console.log(urlSearchParams);
    const episodeListResult = await request<CollectionTableListResp>(`/api/collection/list?${urlSearchParams}`, 'GET');
    setEpisodeListState(episodeListResult);
    return episodeListResult;
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
    await request(`/api/collection/add`, 'POST', state);
  }, []);

  return {
    fetchEpisodeAdd,
  }
}

export function useEditEpisodeState(): {
  fetchEpisodeEdit: (state: CollectionEditReq) => Promise<void>;
} {

  const fetchEpisodeEdit = useCallback(async (state: CollectionEditReq) => {
    await request(`/api/collection/edit`, 'POST', state);
  }, []);

  return {
    fetchEpisodeEdit,
  }
}


export function useDeleteEpisodeState(): {
  fetchEpisodeDelete: (id: number) => Promise<void>;
} {

  const fetchEpisodeDelete = useCallback(async (id: number) => {
    await request(`/api/collection/delete`, 'POST', { id });
  }, []);

  return {
    fetchEpisodeDelete,
  }
}

export function useChangePublishState(): {
  fetchEpisodeChangePublish: (req: CollectionPublishReq) => Promise<void>;
} {
  const fetchEpisodeChangePublish = useCallback(async (req: CollectionPublishReq) => {
    await request(`/api/collection/update_publish_status`, 'POST', req);
  }, []);

  return {
    fetchEpisodeChangePublish,
  }
}
