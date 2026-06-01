import { Button, Input, Label, Link, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import LanguageSelect from "@app/manage-web/components/language-select";
import type { ProductListRespItem } from "@lib/common/dto/product";
import type { Language, Region } from "@lib/common/consts/region";

export default function EditModalButton({ product, onSuccess }: { product: ProductListRespItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const [productState, setProductState] = useState<ProductListRespItem>(product);

  useEffect(() => {
    if (isOpen) {
      setProductState(product);
    }
  }, [isOpen, product]);

  const handleProductEditButton = async () => {
    // await fetchEpisodeEdit(productState);
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
              <Modal.Heading>编辑产品 {productState.host}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">域名</Label>
                <Input variant="secondary" className="flex-1" value={productState.host} onChange={(e) => setProductState({ ...productState, host: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">地区</Label>
                <Input variant="secondary" className="flex-1" value={productState.region} onChange={(e) => setProductState({ ...productState, region: e.target.value as Region })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">语言</Label>
                <LanguageSelect className="flex-1" language={productState.language} onChange={(e) => setProductState({ ...productState, language: e as Language })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">币种</Label>
                <Input variant="secondary" className="flex-1" value={productState.currency} onChange={(e) => setProductState({ ...productState, currency: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">货币符号</Label>
                <Input variant="secondary" className="flex-1" value={productState.currencySign} onChange={(e) => setProductState({ ...productState, currencySign: e.target.value })} />
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
