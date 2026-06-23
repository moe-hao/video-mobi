import { Button, Input, Label, Link, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import LanguageSelect from "@app/manage-web/components/language-select";
import type { ProductEditReq, ProductListRespItem } from "@lib/common/dto/product";
import type { Language, Region } from "@lib/common/consts/region";
import RegionSelect from "@app/manage-web/components/region-select";
import { useEditProduct } from "@app/manage-web/hooks/product";
import CollectionMultipleTypeSelect from "@app/manage-web/components/collection-type-select/collection-multiple-type-select";
import type { CollectionType } from "@lib/common/consts/collection";

export default function EditModalButton({ product, onSuccess }: { product: ProductListRespItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productEditReq, setProductEditReq] = useState({} as ProductEditReq);
  const { fetchEditProduct } = useEditProduct();

  useEffect(() => {
    setProductEditReq({
      id: product.id,
      host: product.host,
      region: product.region,
      language: product.language,
      currency: product.currency,
      currencySign: product.currencySign,
      collectionTypeList: product.collectionTypeList,
      desc: product.desc,
    });
  }, [isOpen, product]);

  const handleProductEditButton = async () => {
    await fetchEditProduct(productEditReq);
    setIsOpen(false);
    onSuccess?.();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑剧集" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>编辑产品</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">域名</Label>
                <Input variant="secondary" className="flex-1" value={productEditReq.host} onChange={(e) => setProductEditReq({ ...productEditReq, host: e.target.value })} />
              </div>

              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">地区</Label>
                <RegionSelect
                  className="w-full"
                  value={productEditReq.region}
                  onChange={(e) => setProductEditReq({ ...productEditReq, region: e as Region })}
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">语言</Label>
                <LanguageSelect className="flex-1" language={productEditReq.language as Language} onChange={(e) => setProductEditReq({ ...productEditReq, language: e as Language })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">剧集类型</Label>
                <CollectionMultipleTypeSelect className="flex-1" collectionTypeList={productEditReq.collectionTypeList} onChange={(e) => setProductEditReq({ ...productEditReq, collectionTypeList: e as CollectionType[] })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">币种</Label>
                <Input variant="secondary" className="flex-1" value={productEditReq.currency} onChange={(e) => setProductEditReq({ ...productEditReq, currency: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">货币符号</Label>
                <Input variant="secondary" className="flex-1" value={productEditReq.currencySign} onChange={(e) => setProductEditReq({ ...productEditReq, currencySign: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">备注</Label>
                <Input variant="secondary" className="flex-1" value={productEditReq.desc} onChange={(e) => setProductEditReq({ ...productEditReq, desc: e.target.value })} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={handleProductEditButton}>
                确认修改
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
