import { Button, Input, Label, Link, Modal, Spinner, TextArea } from "@heroui/react";
import { useEffect, useState } from "react";
import OperateImage from "./operate-image";
import type { CollectionEditReq, CollectionTableListRespItem } from "@lib/common/dto/collection";
import type { Language } from "@lib/common/consts/region";
import { useEditEpisodeState } from "@app/manage-web/hooks/episode";
import LocalTypeSelect from "@app/manage-web/components/local-type-select";
import LanguageSelect from "@app/manage-web/components/language-select";
import CollectionTypeSelect from "@app/manage-web/components/collection-type-select/collection-type-select";

export default function EditModalButton({ item, onSuccess }: { item: CollectionTableListRespItem, onSuccess?: () => void }) {
  const { fetchEpisodeEdit } = useEditEpisodeState();

  const [isOpen, setIsOpen] = useState(false);
  const [collectionEditReq, setCollectionEditReq] = useState<CollectionEditReq>(item);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCollectionEditReq(item);
  }, [isOpen, item]);

  const handleEpisodeEdit = async () => {
    setSubmitting(true);
    try {
      await fetchEpisodeEdit(collectionEditReq);
      setIsOpen(false);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑剧集" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>编辑剧集 {item.id} / 编号: {item.bizId}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row gap-4">
                <OperateImage cover={collectionEditReq.cover} setCover={(cover) => setCollectionEditReq({ ...collectionEditReq, cover })} />
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-10 shrink-0 text-right">原名</Label>
                    <Input variant="secondary" className="w-full" value={collectionEditReq.sourceName} onChange={(e) => setCollectionEditReq({ ...collectionEditReq, sourceName: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-10 shrink-0 text-right">译名</Label>
                    <Input variant="secondary" className="w-full" value={collectionEditReq.name} onChange={(e) => setCollectionEditReq({ ...collectionEditReq, name: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-2 flex-1">
                      <Label className="w-10 shrink-0 text-right">语言</Label>
                      <LanguageSelect className="w-full" language={collectionEditReq.languageCode} onChange={(value) => setCollectionEditReq({ ...collectionEditReq, languageCode: value as Language })} />
                    </div>
                    <div className="flex flex-row items-center gap-2 flex-1">
                      <Label className="w-10 shrink-0 text-right">来源</Label>
                      <LocalTypeSelect className="w-full" local={collectionEditReq.local} onChange={(value) => setCollectionEditReq({ ...collectionEditReq, local: value })} />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Label className="w-10 shrink-0 text-right">类型</Label>
                    <CollectionTypeSelect
                      className="w-full"
                      collectionType={collectionEditReq.collectionType}
                      onChange={(value) => setCollectionEditReq({ ...collectionEditReq, collectionType: value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-14 shrink-0" >总集数</Label>
                  <Input variant="secondary" className="w-full" value={collectionEditReq.episodes} onChange={(e) => setCollectionEditReq({ ...collectionEditReq, episodes: Number(e.target.value) })} />
                </div>
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-14 shrink-0">卡点集</Label>
                  <Input variant="secondary" className="w-full" value={collectionEditReq.cutPoint} onChange={(e) => setCollectionEditReq({ ...collectionEditReq, cutPoint: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">VideoID</Label>
                <Input variant="secondary" className="flex-1" value={collectionEditReq.videoId} onChange={(e) => setCollectionEditReq({ ...collectionEditReq, videoId: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-start gap-4">
                <Label className="w-14 shrink-0">剧集简介</Label>
                <TextArea variant="secondary" aria-label="简介" className="w-full" placeholder="填写简介" value={collectionEditReq.desc} onChange={(e) => setCollectionEditReq({ ...collectionEditReq, desc: e.target.value })} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" isPending={submitting} onClick={handleEpisodeEdit}>
                {({isPending}) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    确认修改
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
