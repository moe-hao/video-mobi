import { Button, Input, Label, Link, ListBox, Modal, Select } from "@heroui/react";
import { useEffect, useState } from "react";
import type { SkuEditReq, SkuManageListItem } from "@lib/common/dto/sku";
import { SkuPeriodType, SkuPeriodTypeName, SkuType } from "@lib/common/consts/sku";
import ProductSelect from "@app/manage-web/components/product-select";
import { useEditSku } from "@app/manage-web/hooks/sku";



export default function EditModalButton({ sku, onSuccess }: { sku: SkuManageListItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [skuEditReq, setSkuEditReq] = useState({} as SkuEditReq);
  const { fetchEditSku } = useEditSku();

  useEffect(() => {
    console.log(sku);
    setSkuEditReq({
      id: sku.id,
      productId: sku.productId,
      price: sku.price,
      desc: sku.desc,
      skuType: sku.skuType as SkuType,
      periodType: sku.periodType as SkuPeriodType,
      paypalPlanId: sku.paypalPlanId,
    });
  }, [isOpen]);

  const handleProductEditButton = async () => {
    await fetchEditSku(skuEditReq);
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
              <Modal.Heading>编辑商品 {sku.id} / {sku.bizId}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">产品域名</Label>
                <ProductSelect className="flex-1" value={skuEditReq.productId} onChange={(productId) => setSkuEditReq({ ...skuEditReq, productId })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">价格</Label>
                <Input variant="secondary" className="flex-1" value={skuEditReq.price} onChange={(e) => setSkuEditReq({ ...skuEditReq, price: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">类型</Label>
                  <Select
                    aria-label="选择商品类型"
                    variant="secondary"
                    className="flex-1"
                    placeholder="选择商品类型"
                    defaultValue={skuEditReq.skuType}
                    onChange={(value) => setSkuEditReq({ ...skuEditReq, skuType: value as SkuType })}
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
                    defaultValue={skuEditReq.periodType}
                    onChange={(value) => setSkuEditReq({ ...skuEditReq, periodType: value as SkuPeriodType })}
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
                <Input variant="secondary" className="flex-1" value={skuEditReq.desc} onChange={(e) => setSkuEditReq({ ...skuEditReq, desc: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">PayPal计划</Label>
                <Input variant="secondary" className="flex-1" value={skuEditReq.paypalPlanId} onChange={(e) => setSkuEditReq({ ...skuEditReq, paypalPlanId: e.target.value })} />
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
