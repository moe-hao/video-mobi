import { Pencil } from "@gravity-ui/icons";
import { Button, Input, Label, Link, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import LanguageSelect from "@app/manage-web/components/language-select";
import { EpisodeSearchSelect } from "./episode-search-select";
import { useEditFeatureState } from "@app/manage-web/hooks/episode/use-feature-state";
import type { CollectionFeatureListRespItem, CollectionTableListRespItem } from "@lib/common/dto/collection";

type SearchEpisode = {
  search: string;
  languageCode: string;
}

export default function EditModalButton({ item, onSuccess }: { item: CollectionFeatureListRespItem, onSuccess?: () => void }) {
  const [episodeFeatureItemState, setEpisodeFeatureItemState] = useState<CollectionFeatureListRespItem>(item);
  const [searchEpisode, setSearchEpisode] = useState<SearchEpisode>({
    search: "",
    languageCode: item.languageCode,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEpisodeListItem, setSelectedEpisodeListItem] = useState<CollectionTableListRespItem>({ id: 0 } as CollectionTableListRespItem);

  const { fetchEpisodeEdit } = useEditFeatureState();

  useEffect(() => {
    if (isOpen) {
      setEpisodeFeatureItemState(item);
      setSearchEpisode({
        search: "",
        languageCode: item.languageCode,
      });
      setSelectedEpisodeListItem({ id: 0 } as CollectionTableListRespItem);
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (searchEpisode.languageCode !== item.languageCode) {
      setSelectedEpisodeListItem({ id: 0 } as CollectionTableListRespItem);
    }
  }, [searchEpisode.languageCode, item.languageCode]);

  // 最终点击编辑
  const handleEpisodeEditButton = async () => {
    await fetchEpisodeEdit({
      id: item.id,
      collectionId: episodeFeatureItemState.collectionId,
      weight: episodeFeatureItemState.weight,
    });
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => {
        setIsOpen(true);
      }}>编辑</Link>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑推荐" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>编辑推荐 - ID: {episodeFeatureItemState.id}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row gap-4">
                <label className="h-48 w-36 rounded-md flex items-center justify-center transition-colors shrink-0 relative group overflow-hidden">
                  {episodeFeatureItemState.cover ? (
                    <img
                      className="h-full w-full object-cover rounded-md"
                      src={episodeFeatureItemState.cover}
                    />
                  ) : (
                    <div className="h-full w-full border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center shrink-0">
                      <span className="text-gray-400 text-xs">无封面</span>
                    </div>
                  )}
                </label>
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-12 shrink-0 text-right">编号</Label>
                    <span className="px-3 py-2 w-full">{episodeFeatureItemState.collectionBizId}</span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-12 shrink-0 text-right">原名</Label>
                    <span className="px-3 py-2 w-full">{episodeFeatureItemState.sourceName}</span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-12 shrink-0 text-right">译名</Label>
                    <span className="px-3 py-2 w-full">{episodeFeatureItemState.name}</span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-12 shrink-0 text-right">语言</Label>
                    <span className="px-3 py-2 w-full">{episodeFeatureItemState.language}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4"></div>
              <div className="flex flex-row items-center gap-2">
                <Label className="w-12 shrink-0">语言</Label>
                <LanguageSelect
                  className="w-full"
                  language={searchEpisode.languageCode}
                  onChange={(value) => {
                    setSearchEpisode(prev => ({ ...prev, languageCode: value }));
                  }}
                />
              </div>
              <div className="flex flex-row items-center gap-2 min-w-0">
                <Label className="w-12 shrink-0">搜索</Label>
                <EpisodeSearchSelect
                  value={selectedEpisodeListItem}
                  onChange={(episode) => {
                    setSelectedEpisodeListItem(episode);
                    setEpisodeFeatureItemState({
                      id: episodeFeatureItemState.id,
                      collectionId: episode.id,
                      collectionBizId: episode.bizId,
                      name: episode.name,
                      sourceName: episode.sourceName,
                      cover: episode.cover,
                      languageCode: episode.languageCode,
                      language: episode.language,
                      weight: episodeFeatureItemState.weight,
                      createTime: episode.createTime,
                      updateTime: episode.updateTime,
                    });
                  }}
                  languageCode={searchEpisode.languageCode}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <Label className="w-12 shrink-0">权重</Label>
                <Input
                  variant="secondary"
                  className="flex-1"
                  value={episodeFeatureItemState.weight}
                  onChange={(e) => setEpisodeFeatureItemState(prev => ({ ...prev, weight: Number(e.target.value) }))}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={handleEpisodeEditButton}>
                <Pencil />
                确认修改
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
