import { Button, Input, Select, Label, Modal, ListBox } from "@heroui/react";
import { useEffect, useState } from "react";
import ProductSelect from "@app/manage-web/components/product-select";
import type { SkuAddReq } from "@lib/common/dto/sku";
import { SkuPeriodType, SkuPeriodTypeName, SkuType } from "@lib/common/consts/sku";
import { useAddSku } from "@app/manage-web/hooks/sku";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [skuAddReq, setSkuAddReq] = useState<SkuAddReq>({} as SkuAddReq);
  const { fetchAddSku } = useAddSku();

  useEffect(() => {
    setSkuAddReq({} as SkuAddReq);
  }, [isOpen]);

  const handleProductEditButton = async () => {
    await fetchAddSku(skuAddReq);
    setIsOpen(false);
    onSuccess?.();
  }


  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>新建商品</Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑剧集" className="gray-100 min-w-[600px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>新建商品</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">产品域名</Label>
                <ProductSelect className="flex-1" value={skuAddReq.productId} onChange={(productId) => setSkuAddReq({ ...skuAddReq, productId })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">价格</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setSkuAddReq({ ...skuAddReq, price: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">类型</Label>
                  <Select
                    aria-label="选择商品类型"
                    variant="secondary"
                    className="flex-1"
                    placeholder="选择商品类型"
                    defaultValue={skuAddReq.skuType}
                    onChange={(value) => setSkuAddReq({ ...skuAddReq, skuType: value as SkuType })}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item key={SkuType.Subscription} id={SkuType.Subscription} textValue="订阅">订阅</ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-10 shrink-0 text-right">周期</Label>
                  <Select
                    aria-label="选择订阅周期"
                    variant="secondary"
                    className="flex-1"
                    placeholder="选择订阅周期"
                    defaultValue={skuAddReq.periodType}
                    onChange={(value) => setSkuAddReq({ ...skuAddReq, periodType: value as SkuPeriodType })}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {
                          Object.values(SkuPeriodType).map((item) => (
                            <ListBox.Item key={item} id={item} textValue={item}>{SkuPeriodTypeName[item]}</ListBox.Item>
                          ))
                        }
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18  shrink-0 text-right">横幅描述</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setSkuAddReq({ ...skuAddReq, desc: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">PayPal计划</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setSkuAddReq({ ...skuAddReq, paypalPlanId: e.target.value })} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={handleProductEditButton}>
                新建商品
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal >
  );
}
