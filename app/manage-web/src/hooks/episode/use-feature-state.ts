import { useCallback, useState } from "react";
import { request } from "@lib/common/utils/request-manage";
import { convertURLSearchParams } from "@lib/common/utils/param";
import type { CollectionFeatureAddReq, CollectionFeatureEditReq, CollectionFeatureListReq, CollectionFeatureListResp } from "@lib/common/dto/collection";

export function useFeatureState(): {
  episodeFeatureListPage: CollectionFeatureListResp;
  fetchEpisodeFeatureList: (req: CollectionFeatureListReq) => Promise<CollectionFeatureListResp>;
} {
  const [episodeFeatureListPage, setEpisodeFeatureListPage] = useState<CollectionFeatureListResp>({} as CollectionFeatureListResp);

  const fetchEpisodeFeatureList = useCallback(async (req: CollectionFeatureListReq) => {
    const urlSearchParams = convertURLSearchParams(req)
    const resp = await request<CollectionFeatureListResp>(`/api/collection_feature/list?${urlSearchParams}`, 'GET');
    setEpisodeFeatureListPage(resp);
    return resp;
  }, []);

  return {
    episodeFeatureListPage,
    fetchEpisodeFeatureList,
  };
}

export function useEditFeatureState(): {
  fetchEpisodeEdit: (req: CollectionFeatureEditReq) => Promise<void>;
} {
  const fetchEpisodeEdit = useCallback(async (req: CollectionFeatureEditReq) => {
    await request(`/api/collection_feature/edit`, 'POST', req);
  }, []);

  return {
    fetchEpisodeEdit,
  };
}

export function useAddFeatureState(): {
  fetchEpisodeAdd: (req: CollectionFeatureAddReq) => Promise<void>;
} {
  const fetchEpisodeAdd = useCallback(async (req: CollectionFeatureAddReq) => {
    await request(`/api/collection_feature/add`, 'POST', req);
  }, []);

  return {
    fetchEpisodeAdd,
  };
}

export function useDeleteFeatureState(): {
  fetchEpisodeDelete: (id: number) => Promise<void>;
} {
  const fetchEpisodeDelete = useCallback(async (id: number) => {
    await request(`/api/collection_feature/delete`, 'POST', { id });
  }, []);

  return {
    fetchEpisodeDelete,
  };
}
