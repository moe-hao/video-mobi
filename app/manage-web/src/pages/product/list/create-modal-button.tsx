import { Button, Input, Label, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import LanguageSelect from "@app/manage-web/components/language-select";
import type { ProductAddReq } from "@lib/common/dto/product";
import type { Language, Region } from "@lib/common/consts/region";
import RegionSelect from "@app/manage-web/components/region-select";
import { useAddProduct } from "@app/manage-web/hooks/product";
import type { CollectionType } from "@lib/common/consts/collection";
import CollectionMultipleTypeSelect from "@app/manage-web/components/collection-type-select/collection-multiple-type-select";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productAddReq, setProductAddReq] = useState<ProductAddReq>({} as ProductAddReq);
  const { fetchAddProduct } = useAddProduct();

  useEffect(() => {
    setProductAddReq({} as ProductAddReq);
  }, [isOpen]);

  const handleProductEditButton = async () => {
    await fetchAddProduct(productAddReq);
    setIsOpen(false);
    onSuccess?.();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>新建产品</Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑剧集" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>新建产品</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">域名</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setProductAddReq({ ...productAddReq, host: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">地区</Label>
                <RegionSelect
                  className="w-full"
                  value={productAddReq.region}
                  onChange={(e) => setProductAddReq({ ...productAddReq, region: e as Region })}
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">语言</Label>
                <LanguageSelect className="flex-1" language={productAddReq.language as Language} onChange={(e) => setProductAddReq({ ...productAddReq, language: e as Language })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">剧集类型</Label>
                <CollectionMultipleTypeSelect className="flex-1" collectionTypeList={productAddReq.collectionTypeList} onChange={(e) => setProductAddReq({ ...productAddReq, collectionTypeList: e as CollectionType[] })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">币种</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setProductAddReq({ ...productAddReq, currency: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">货币符号</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setProductAddReq({ ...productAddReq, currencySign: e.target.value })} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={handleProductEditButton}>
                新建产品
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
