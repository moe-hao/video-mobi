import { Button, Spinner, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import SyncButton from "./sync-button";
import DownloadButton from "./download-button";
import type { VideoListReq } from "@lib/common/dto/video";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { CollectionPublishReq } from "@lib/common/dto/collection";
import { PublishStatus } from "@lib/common/consts/collection";
import { useChangePublishState, useDownloadEpisodeState, useEpisodeVideoState, useVideoState } from "@app/manage-web/hooks/episode";

export default function EpisodeVideo() {
  const [searchParams] = useSearchParams();
  const collectionId = Number(searchParams.get('collectionId'));

  const [videoListReq] = useState<VideoListReq>({
    page: 1,
    size: 20,
    collectionId: collectionId,
  });

  const { videoListPage, fetchVideoList } = useVideoState();
  const { fetchSyncEpisodeVideo } = useEpisodeVideoState();
  const { fetchDownloadEpisodeVideo } = useDownloadEpisodeState();
  const { fetchEpisodeChangePublish } = useChangePublishState();

  const [isClickChangePublish, setIsClickChangePublish] = useState(false);

  useEffect(() => {
    fetchVideoList(videoListReq);
  }, [fetchVideoList]);

  const handleSyncEpisodeVideo = async () => {
    await fetchSyncEpisodeVideo(collectionId);
    fetchVideoList(videoListReq);
  };

  const handleDownloadEpisodeVideo = async () => {
    await fetchDownloadEpisodeVideo(collectionId);
    fetchVideoList(videoListReq);
  };

  const handleSuccess = async () => {
    await fetchVideoList(videoListReq);
  };

  const handleChangePublishState = async (req: CollectionPublishReq) => {
    setIsClickChangePublish(true);
    await fetchEpisodeChangePublish(req);
    await fetchVideoList(videoListReq);
    setIsClickChangePublish(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-bold">剧集详情: [ {videoListPage.collectionBizId || ''} ] {videoListPage.collectionName || ''}</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1"></div>
        {
          videoListPage.publishStatus === PublishStatus.Unpublished ? (
            <Button
              variant="primary" size="sm" isPending={isClickChangePublish}
              onClick={() => handleChangePublishState({ id: collectionId, publishStatus: PublishStatus.Published })}>
              {isClickChangePublish && <Spinner color="current" size="sm" />}
              上架全部剧集
            </Button>
          ) : (
            <Button
              variant="danger-soft" size="sm" isPending={isClickChangePublish}
              onClick={() => handleChangePublishState({ id: collectionId, publishStatus: PublishStatus.Unpublished })}>
              {isClickChangePublish && <Spinner color="current" size="sm" />}
              下架全部剧集
            </Button>
          )
        }
        {videoListPage.total === 0 &&
          <SyncButton onConfirm={handleSyncEpisodeVideo} onSuccess={handleSuccess} />
        }
        <DownloadButton onConfirm={handleDownloadEpisodeVideo} onSuccess={handleSuccess} />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="collection-video" className="min-w-[600px]">
            <Table.Header>
              <Table.Column>ID</Table.Column>
              <Table.Column isRowHeader>集数</Table.Column>
              <Table.Column>VID</Table.Column>
              <Table.Column>创建日期</Table.Column>
              <Table.Column>更新日期</Table.Column>
            </Table.Header>
            <Table.Body>
              {
                videoListPage.list?.map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.epNum}</Table.Cell>
                    <Table.Cell>{item.vid}</Table.Cell>
                    <Table.Cell>{item.createTime}</Table.Cell>
                    <Table.Cell>{item.updateTime}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={videoListPage.page || 1}
        size={videoListPage.size || 10}
        total={videoListPage.total || 0}
        onPageChange={(page) => fetchVideoList({ ...videoListReq, page })}
      />
    </div>
  )
}
