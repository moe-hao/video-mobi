import { useCallback, useState } from "react";
import { convertURLSearchParams } from "@lib/common/utils/param";
import type { CollectionFeatureAddReq, CollectionFeatureEditReq, CollectionFeatureListReq, CollectionFeatureListResp } from "@lib/common/dto/collection";
import http from "@lib/common/utils/http/manage";

export function useFeatureState(): {
  episodeFeatureListPage: CollectionFeatureListResp;
  fetchEpisodeFeatureList: (req: CollectionFeatureListReq) => Promise<CollectionFeatureListResp>;
} {
  const [episodeFeatureListPage, setEpisodeFeatureListPage] = useState<CollectionFeatureListResp>({} as CollectionFeatureListResp);

  const fetchEpisodeFeatureList = useCallback(async (req: CollectionFeatureListReq) => {
    const urlSearchParams = convertURLSearchParams(req);
    const resp = await http.get<CollectionFeatureListResp>(`/api/collection_feature/list?${urlSearchParams}`);
    setEpisodeFeatureListPage(resp.data);
    return resp.data;
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
    await http.post(`/api/collection_feature/edit`, req);
  }, []);

  return {
    fetchEpisodeEdit,
  };
}

export function useAddFeatureState(): {
  fetchEpisodeAdd: (req: CollectionFeatureAddReq) => Promise<void>;
} {
  const fetchEpisodeAdd = useCallback(async (req: CollectionFeatureAddReq) => {
    await http.post(`/api/collection_feature/add`, req);
  }, []);

  return {
    fetchEpisodeAdd,
  };
}

export function useDeleteFeatureState(): {
  fetchEpisodeDelete: (id: number) => Promise<void>;
} {
  const fetchEpisodeDelete = useCallback(async (id: number) => {
    await http.post(`/api/collection_feature/delete`, { id });
  }, []);

  return {
    fetchEpisodeDelete,
  };
}
