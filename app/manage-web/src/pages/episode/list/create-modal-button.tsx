import { Plus } from "@gravity-ui/icons";
import { Button, Input, Label, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import LanguageSelect from "@app/manage-web/components/language-select";
import OperateImage from "./operate-image";
import { useCreateEpisodeState } from "@app/manage-web/hooks/episode/use-episode-state";
import CollectionTypeSelect from "@app/manage-web/components/collection-type-select";
import LocalTypeSelect from "@app/manage-web/components/local-type-select";
import type { CollectionAddReq } from "@lib/common/dto/collection";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const { fetchEpisodeAdd } = useCreateEpisodeState();

  const [isOpen, setIsOpen] = useState(false);
  const [collectionAddReq, setCollectionAddReq] = useState<CollectionAddReq>({} as CollectionAddReq);

  useEffect(() => {
    setCollectionAddReq({} as CollectionAddReq);
  }, [isOpen]);

  const handleCollectionAdd = async () => {
    await fetchEpisodeAdd(collectionAddReq);
    setIsOpen(false);
    onSuccess?.();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}><Plus />添加剧集</Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑剧集" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>添加新剧</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row gap-4">
                <OperateImage cover={collectionAddReq.cover} setCover={(cover) => setCollectionAddReq({ ...collectionAddReq, cover })} />
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-10 shrink-0 text-right">原名</Label>
                    <Input variant="secondary" className="w-full" value={collectionAddReq.sourceName} onChange={(e) => setCollectionAddReq({ ...collectionAddReq, sourceName: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-10 shrink-0 text-right">译名</Label>
                    <Input variant="secondary" className="w-full" value={collectionAddReq.name} onChange={(e) => setCollectionAddReq({ ...collectionAddReq, name: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-2 flex-1">
                      <Label className="w-10 shrink-0 text-right">语言</Label>
                      <LanguageSelect className="w-full" language={collectionAddReq.languageCode} onChange={(value) => setCollectionAddReq({ ...collectionAddReq, languageCode: value })} />
                    </div>
                    <div className="flex flex-row items-center gap-2 flex-1">
                      <Label className="w-10 shrink-0 text-right">来源</Label>
                      <LocalTypeSelect className="w-full" local={collectionAddReq.local} onChange={(value) => setCollectionAddReq({ ...collectionAddReq, local: value })} />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-10 shrink-0 text-right">类型</Label>
                    <CollectionTypeSelect className="w-full" collectionType={collectionAddReq.collectionType} onChange={(value) => setCollectionAddReq({ ...collectionAddReq, collectionType: value })} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-14 shrink-0" >总集数</Label>
                  <Input variant="secondary" className="w-full" onChange={(e) => setCollectionAddReq({ ...collectionAddReq, episodes: Number(e.target.value) })} />
                </div>
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-14 shrink-0">卡点集</Label>
                  <Input variant="secondary" className="w-full" onChange={(e) => setCollectionAddReq({ ...collectionAddReq, cutPoint: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">VideoID</Label>
                <Input variant="secondary" className="w-full" onChange={(e) => setCollectionAddReq({ ...collectionAddReq, videoId: Number(e.target.value) })} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={handleCollectionAdd}>
                确认添加
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
