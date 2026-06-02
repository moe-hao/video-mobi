import { Button, Input, Link, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { Xmark } from "@gravity-ui/icons";
import EditModalButton from "./edit-modal-button";
import CreateModalButton from "./create-modal-button";
import { useNavigate, useSearchParams } from "react-router";
import type { CollectionPublishReq, CollectionTableListReq } from "@lib/common/dto/collection";
import type { Language } from "@lib/common/consts/region";
import { PublishStatus } from "@lib/common/consts/collection";
import LanguageSelect from "@app/manage-web/components/language-select";
import DeleteButton from "@app/manage-web/components/delete-button";
import { useChangePublishState, useDeleteEpisodeState, useEpisodeState } from "@app/manage-web/hooks/episode";
import TablePagination from "@app/manage-web/components/pagination/pagination";

export default function EpisodeList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { episodeListState, fetchEpisodeList } = useEpisodeState();
  const { fetchEpisodeDelete } = useDeleteEpisodeState();
  const { fetchEpisodeChangePublish } = useChangePublishState();

  const [collectionTableListReq, setCollectionTableListReq] = useState<CollectionTableListReq>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 7,
    search: searchParams.get('search') || '',
    language: searchParams.get('language') as Language || '',
  });

  const changeSearchParams = (search: CollectionTableListReq) => {
    setSearchParams({
      page: search.page.toString(),
      size: search.size.toString(),
      search: search.search,
      language: search.language || '',
    });
  };

  useEffect(() => {
    fetchEpisodeList(collectionTableListReq);
    changeSearchParams(collectionTableListReq);
  }, []);

  const handleSearch = async (search: CollectionTableListReq) => {
    setCollectionTableListReq(search);
    await fetchEpisodeList(search);
    changeSearchParams(search);
  };

  const handlePublish = async (req: CollectionPublishReq) => {
    await fetchEpisodeChangePublish(req);
    await fetchEpisodeList(collectionTableListReq);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-bold">剧集列表</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索ID/编号/剧名/译名"
            className="w-48"
            value={collectionTableListReq.search}
            onChange={(e) => setCollectionTableListReq({ ...collectionTableListReq, search: e.target.value })}
          />
          <div className="relative">
            <LanguageSelect
              className="w-[192px]"
              language={collectionTableListReq.language as Language}
              onChange={(value) => setCollectionTableListReq({ ...collectionTableListReq, language: value })}
            />
            {collectionTableListReq.language && (
              <Button
                variant="ghost"
                isIconOnly
                size="sm"
                className="absolute right-7 top-1/2 -translate-y-1/2 min-w-6 h-6"
                onClick={() => setCollectionTableListReq({ ...collectionTableListReq, language: '' })}
              >
                <Xmark className="size-3" />
              </Button>
            )}
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={async () => await handleSearch({ ...collectionTableListReq, page: 1 })}>查询</Button>
        <div className="flex-1"></div>
        <CreateModalButton onSuccess={() => fetchEpisodeList(collectionTableListReq)} />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="min-w-[600px]">
            <Table.Header>
              <Table.Column>ID</Table.Column>
              <Table.Column isRowHeader>基本信息</Table.Column>
              <Table.Column>总集数</Table.Column>
              <Table.Column>卡点集</Table.Column>
              <Table.Column>语言</Table.Column>
              <Table.Column>类型</Table.Column>
              <Table.Column>上架状态</Table.Column>
              <Table.Column>日期</Table.Column>
              <Table.Column>操作</Table.Column>
            </Table.Header>
            <Table.Body>
              {
                episodeListState.list?.map(item => (
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
                            <span className="text-muted-foreground truncate">{item.bizId}</span>
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
                    <Table.Cell>{item.episodes}</Table.Cell>
                    <Table.Cell>{item.cutPoint}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col gap-1.5 min-w-0 items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-10 flex-shrink-0">语言:</span>
                            <span className="text-muted-foreground truncate">{item.language}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-10 flex-shrink-0">来源:</span>
                            <span className="text-muted-foreground truncate">{item.localName}</span>
                          </div>
                        </div>
                    </Table.Cell>
                    <Table.Cell>{item.collectionTypeName}</Table.Cell>
                    <Table.Cell>
                      {item.publishStatus === PublishStatus.Published ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          已上架
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          未上架
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-4 p-2 transition-colors">
                        <div className="flex flex-col gap-1.5 min-w-0 items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-18 flex-shrink-0">创建时间:</span>
                            <span className="text-muted-foreground truncate">{item.createTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium w-18 flex-shrink-0">更新时间:</span>
                            <span className="text-muted-foreground truncate">{item.updateTime}</span>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => navigate(`/episode/video?collectionId=${item.id}`)}>
                        查看
                      </Link>
                      <EditModalButton item={item} onSuccess={async () => await handleSearch(collectionTableListReq)} />
                      {
                        item.publishStatus === PublishStatus.Published ? (
                          <Link className="no-underline hover:underline text-red-500 mr-2" onClick={() => handlePublish({ id: item.id, publishStatus: PublishStatus.Unpublished })}>
                            下架
                          </Link>
                        ) : (
                          <Link className="no-underline hover:underline text-accent mr-2" onClick={() => handlePublish({ id: item.id, publishStatus: PublishStatus.Published })}>
                            上架
                          </Link>
                        )
                      }
                      <DeleteButton id={item.id} onConfirm={(id) => fetchEpisodeDelete(id)} onSuccess={async () => await handleSearch(collectionTableListReq)} />
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={episodeListState.page || 1}
        size={episodeListState.size || 10}
        total={episodeListState.total || 0}
        sizeOptions={[7, 10, 20, 30]}
        onPageChange={async (page) => await handleSearch({ ...collectionTableListReq, page })}
        onSizeChange={async (size) => await handleSearch({ ...collectionTableListReq, size })}
      />
    </div>
  )
}
