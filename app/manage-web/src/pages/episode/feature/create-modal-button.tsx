import { Plus } from "@gravity-ui/icons";
import { Button, Input, Label, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import LanguageSelect from "@app/manage-web/components/language-select";
import { EpisodeSearchSelect } from "./episode-search-select";
import { useAddFeatureState } from "@app/manage-web/hooks/episode/use-feature-state";
import type { CollectionFeatureAddReq, CollectionTableListRespItem } from "@lib/common/dto/collection";
import type { Language } from "@lib/common/consts/region";

type SearchEpisode = {
  search: string;
  languageCode: string;
}

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [collectionFeatureAddReq, setCollectionFeatureAddReq] = useState<CollectionFeatureAddReq>({} as CollectionFeatureAddReq);
  const [selectedEpisodeListItem, setSelectedEpisodeListItem] = useState<CollectionTableListRespItem>({} as CollectionTableListRespItem);

  const [searchEpisode, setSearchEpisode] = useState<SearchEpisode>({} as SearchEpisode);
  const [isOpen, setIsOpen] = useState(false);

  const { fetchEpisodeAdd } = useAddFeatureState();

  useEffect(() => {
    setCollectionFeatureAddReq({} as CollectionFeatureAddReq);
    setSelectedEpisodeListItem({} as CollectionTableListRespItem);
  }, [isOpen]);

  const handleCreateCollectionFeature = async () => {
    await fetchEpisodeAdd(collectionFeatureAddReq);
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}><Plus />添加推荐</Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="添加推荐" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>添加推荐</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row gap-4">
                <label className="h-48 w-36 rounded-md flex items-center justify-center transition-colors shrink-0 relative group overflow-hidden">
                  {selectedEpisodeListItem.cover ? (
                    <img
                      className="h-full w-full object-cover rounded-md"
                      src={selectedEpisodeListItem.cover}
                    />
                  ) : (
                    <div className="h-full w-full border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center shrink-0">
                      <span className="text-gray-400 text-xs">选择剧集预览</span>
                    </div>
                  )}
                </label>
                <div className="flex flex-col gap-3 flex-1">
                  {
                    selectedEpisodeListItem.bizId ? (
                      <>
                        <div className="flex flex-row items-center gap-2">
                          <Label className="w-12 shrink-0 text-right">编号</Label>
                          <span className="px-3 py-2 w-full">{selectedEpisodeListItem.bizId}</span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Label className="w-12 shrink-0 text-right">原名</Label>
                          <span className="px-3 py-2 w-full">{selectedEpisodeListItem.sourceName}</span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Label className="w-12 shrink-0 text-right">译名</Label>
                          <span className="px-3 py-2 w-full">{selectedEpisodeListItem.name}</span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Label className="w-12 shrink-0 text-right">语言</Label>
                          <span className="px-3 py-2 w-full">{selectedEpisodeListItem.language}</span>
                        </div>
                      </>
                    ) :
                      (
                        <div className="flex flex-row items-center gap-2">
                          请选择剧集
                        </div>
                      )
                  }

                </div>
              </div>
              <div className="flex flex-row gap-4"></div>
              <div className="flex flex-row items-center gap-2">
                <Label className="w-12 shrink-0">语言</Label>
                <LanguageSelect className="w-full" language={searchEpisode.languageCode as Language} onChange={(value) => setSearchEpisode({...searchEpisode, languageCode: value})}
                />
              </div>
              <div className="flex flex-row items-center gap-2 min-w-0">
                <Label className="w-12 shrink-0">搜索</Label>
                <EpisodeSearchSelect
                  key={`${isOpen}-${searchEpisode.languageCode}`}
                  value={selectedEpisodeListItem}
                  isDisabled={!searchEpisode.languageCode}
                  onChange={(episode) => {
                    setSelectedEpisodeListItem(episode);
                    setCollectionFeatureAddReq({...collectionFeatureAddReq, collectionId: episode.id})
                  }}
                  languageCode={searchEpisode.languageCode}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <Label className="w-12 shrink-0">权重</Label>
                <Input
                  variant="secondary"
                  className="flex-1"
                  value={collectionFeatureAddReq.weight ?? ""}
                  onChange={(e) => setCollectionFeatureAddReq({...collectionFeatureAddReq, weight: Number(e.target.value)})}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={handleCreateCollectionFeature}>
                确认创建
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
