import { Button, Input, Spinner, Table, ToggleButton, Tooltip } from "@heroui/react";
import { useFeatureState, useDeleteFeatureState } from "@app/manage-web/hooks/episode";
import { useEffect, useState } from "react";
import { BarsDescendingAlignLeftArrowDown, CircleInfo, Xmark } from "@gravity-ui/icons";
import DeleteButton from "@app/manage-web/components/delete-button";
import EditModalButton from "./edit-modal-button";
import LanguageSelect from "@app/manage-web/components/language-select";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import CreateModalButton from "./create-modal-button";
import type { CollectionFeatureListReq } from "@lib/common/dto/collection";
import { CollectionFeatureSortStatus } from "@lib/common/consts/collection-feature";
import type { Language } from "@lib/common/consts/region";
import { useSearchParams } from "react-router";

export default function EpisodeFeature() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { episodeFeatureListPage, fetchEpisodeFeatureList } = useFeatureState();
  const { fetchEpisodeDelete } = useDeleteFeatureState();

  const [loading, setLoading] = useState(false);

  const [collectionFeatureListReq, setCollectionFeatureListReq] = useState<CollectionFeatureListReq>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 7,
    episodeSearch: searchParams.get('episodeSearch') || '',
    languageCode: searchParams.get('languageCode') as Language || '',
    weightSort: CollectionFeatureSortStatus.Default,
  });

  const changeSearchParams = (search: CollectionFeatureListReq) => {
    setSearchParams({
      page: search.page.toString(),
      size: search.size.toString(),
      episodeSearch: search.episodeSearch,
      languageCode: search.languageCode || '',
      weightSort: search.weightSort?.toString() || '',
    });
  }

  useEffect(() => {
    setLoading(true);
    fetchEpisodeFeatureList(collectionFeatureListReq).finally(() => setLoading(false));
    changeSearchParams(collectionFeatureListReq);
  }, [fetchEpisodeFeatureList]);

  const handleSearch = async (search: CollectionFeatureListReq) => {
    setCollectionFeatureListReq(search);
    setLoading(true);
    try {
      await fetchEpisodeFeatureList(search);
      changeSearchParams(search);
    } finally {
      setLoading(false);
    }
  }

  const handleWeightSort = async (isSelected: boolean) => {
    if (isSelected) {
      collectionFeatureListReq.weightSort = CollectionFeatureSortStatus.Desc
    } else {
      collectionFeatureListReq.weightSort = CollectionFeatureSortStatus.Default
    }
    setCollectionFeatureListReq(collectionFeatureListReq);
    setLoading(true);
    try {
      await fetchEpisodeFeatureList(collectionFeatureListReq);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-bold">首页推荐</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索ID/编号/剧名/译名"
            className="w-48"
            value={collectionFeatureListReq.episodeSearch}
            onChange={(e) => setCollectionFeatureListReq({ ...collectionFeatureListReq, episodeSearch: e.target.value })}
          />
          <div className="relative">
            <LanguageSelect
              className="w-48"
              language={collectionFeatureListReq.languageCode as Language}
              onChange={(value) => setCollectionFeatureListReq({ ...collectionFeatureListReq, languageCode: value })}
            />
            {collectionFeatureListReq.languageCode && (
              <Button
                variant="ghost"
                isIconOnly
                size="sm"
                className="absolute right-7 top-1/2 -translate-y-1/2 min-w-6 h-6"
                onClick={() => setCollectionFeatureListReq({ ...collectionFeatureListReq, languageCode: '' })}
              >
                <Xmark className="size-3" />
              </Button>
            )}
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(collectionFeatureListReq)}>查询</Button>
        <div className="flex-1"></div>
        <ToggleButton
          size="sm"
          onChange={async (isSelected) => await handleWeightSort(isSelected)}>
          <BarsDescendingAlignLeftArrowDown />
          权重排名
        </ToggleButton>
        <CreateModalButton onSuccess={() => handleSearch({ ...collectionFeatureListReq, page: 1 })} />
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
        <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="min-w-[600px]">
            <Table.Header>
              <Table.Column>ID</Table.Column>
              <Table.Column isRowHeader>推荐剧集</Table.Column>
              <Table.Column>语言</Table.Column>
              <Table.Column>
                <span className="flex items-center gap-1">
                  权重
                  <Tooltip delay={0}>
                    <Button isIconOnly variant="ghost" className="w-3 h-3">
                      <CircleInfo className="w-3 h-3" />
                    </Button>
                    <Tooltip.Content>
                      <p>权重越大越靠前</p>
                    </Tooltip.Content>
                  </Tooltip>
                </span>
              </Table.Column>
              <Table.Column>日期</Table.Column>
              <Table.Column>操作</Table.Column>
            </Table.Header>
            <Table.Body>
              {
                episodeFeatureListPage.list?.map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-4 p-2 transition-colors">
                        {item.cover ? (
                          <img
                            className="h-24 object-cover rounded-md shadow-sm"
                            src={item.cover}
                          />
                        ) : (
                          <div className="h-24 w-18 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center shrink-0">
                            <span className="text-gray-400 text-xs">无封面</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5 min-w-0 items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-10 flex-shrink-0">编号:</span>
                            <span className="text-muted-foreground truncate">{item.collectionBizId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-10 flex-shrink-0">原名:</span>
                            <span className="text-muted-foreground truncate">{item.sourceName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-10 flex-shrink-0">译名:</span>
                            <span className="text-muted-foreground truncate">{item.name}</span>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{item.language}</Table.Cell>
                    <Table.Cell>{item.weight}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-4 p-2 transition-colors">
                        <div className="flex flex-col gap-1.5 min-w-0 items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-18 flex-shrink-0">创建日期:</span>
                            <span className="text-muted-foreground truncate">{item.createTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-18 flex-shrink-0">更新日期:</span>
                            <span className="text-muted-foreground truncate">{item.updateTime}</span>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <EditModalButton item={item} onSuccess={() => handleSearch(collectionFeatureListReq)} />
                      <DeleteButton id={item.id} onConfirm={(id) => fetchEpisodeDelete(id)} onSuccess={() => handleSearch(collectionFeatureListReq)} />
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      </div>
      <TablePagination
        page={episodeFeatureListPage.page || 1}
        size={episodeFeatureListPage.size || 10}
        total={episodeFeatureListPage.total || 0}
        sizeOptions={[7, 10, 20, 30]}
        onPageChange={async (page) => await handleSearch({ ...collectionFeatureListReq, page })}
        onSizeChange={async (size) => await handleSearch({ ...collectionFeatureListReq, size })}
      />

    </div>
  );
}
