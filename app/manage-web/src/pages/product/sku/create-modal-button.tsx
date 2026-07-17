import { Button, Input, Label, Modal } from "@heroui/react";
import { useEffect, useState } from "react";
import ProductSelect from "@app/manage-web/components/product-select";
import type { SkuAddReq } from "@lib/common/dto/sku";
import { SkuImportant, SkuPeriodType, SkuType } from "@lib/common/consts/sku";
import { useAddSku } from "@app/manage-web/hooks/sku";
import { SkuImportantSelect } from "./sku-important-select";
import { SkuTypeSelect } from "./sku-type-select";
import { SkuPeriodSelect } from "./sku-period-select";
import PaymentOptionSelect from "@app/manage-web/components/payment-option-select";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [skuAddReq, setSkuAddReq] = useState<SkuAddReq>({
    coinNum: 0,
    coinBonus: 0,
    periodType: "",
    periodTotal: 0,
    weight: 0,
    desc: "",
    paypalPlanId: "",
  } as SkuAddReq);
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
                <Label className="w-18 shrink-0 text-right">支付选项</Label>
                <PaymentOptionSelect className="flex-1" value={skuAddReq.paymentOptionId} onChange={(paymentOptionId: number) => setSkuAddReq({ ...skuAddReq, paymentOptionId })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">价格</Label>
                <Input variant="secondary" className="flex-1" placeholder="输入价格" onChange={(e) => setSkuAddReq({ ...skuAddReq, price: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">类型</Label>
                  <SkuTypeSelect className="flex-1" value={skuAddReq.skuType} onChange={(value) => setSkuAddReq({ ...skuAddReq, skuType: value as SkuType })} />
                </div>
                {
                  skuAddReq.skuType === SkuType.Subscription ? (
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <Label className="w-10 shrink-0 text-right">周期</Label>
                      <SkuPeriodSelect className="flex-1" value={skuAddReq.periodType as SkuPeriodType} onChange={(value) => setSkuAddReq({ ...skuAddReq, periodType: value as SkuPeriodType })} />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <Label className="w-10 shrink-0 text-right">个数</Label>
                      <Input className="flex-1" variant="secondary" placeholder="输入个数" value={skuAddReq.coinNum} onChange={(e) => setSkuAddReq({ ...skuAddReq, coinNum: Number(e.target.value) })} />
                    </div>
                  )
                }
              </div>
              {
                skuAddReq.skuType === SkuType.Subscription ? (
                  <div className="flex flex-row items-center gap-4">
                    <Label className="w-18  shrink-0 text-right">周期总数</Label>
                    <Input variant="secondary" className="flex-1" value={skuAddReq.periodTotal} type="number" onChange={(e) => setSkuAddReq({ ...skuAddReq, periodTotal: Number(e.target.value) })} />
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-4">
                    <Label className="w-18 shrink-0 text-right">赠送金币</Label>
                    <Input variant="secondary" className="flex-1" placeholder="输入赠送金币" value={skuAddReq.coinBonus} onChange={(e) => setSkuAddReq({ ...skuAddReq, coinBonus: Number(e.target.value) })} />
                  </div>
                )
              }
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">权重</Label>
                <Input variant="secondary" className="flex-1" value={skuAddReq.weight} onChange={(e) => setSkuAddReq({ ...skuAddReq, weight: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">重点展示</Label>
                <SkuImportantSelect className="flex-1" value={skuAddReq.important} onChange={(value) => setSkuAddReq({ ...skuAddReq, important: value as SkuImportant })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18  shrink-0 text-right">横幅描述</Label>
                <Input variant="secondary" className="flex-1" onChange={(e) => setSkuAddReq({ ...skuAddReq, desc: e.target.value })} />
              </div>
              {skuAddReq.skuType === SkuType.Subscription && (
                <div className="flex flex-row items-center gap-4">
                  <Label className="w-18 shrink-0 text-right">PayPal计划</Label>
                  <Input variant="secondary" className="flex-1" onChange={(e) => setSkuAddReq({ ...skuAddReq, paypalPlanId: e.target.value })} />
                </div>
              )}
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
