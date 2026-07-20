import { Button, Drawer, Input, Label, Link, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import type { SkuEditReq, SkuManageListItem } from "@lib/common/dto/sku";
import { SkuImportant, SkuPeriodType, SkuType } from "@lib/common/consts/sku";
import ProductSelect from "@app/manage-web/components/product-select";
import { useEditSku } from "@app/manage-web/hooks/sku";
import { useToast } from "@app/manage-web/contexts/toast-context";
import { SkuImportantSelect } from "./sku-important-select";
import { SkuPeriodSelect } from "./sku-period-select";
import { SkuTypeSelect } from "./sku-type-select";
import PaymentOptionSelect from "@app/manage-web/components/payment-option-select";
import { SkuRegionSelect } from "./sku-region-select";

export default function EditModalButton({ sku, onSuccess }: { sku: SkuManageListItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [skuEditReq, setSkuEditReq] = useState({} as SkuEditReq);
  const toast = useToast();
  const { fetchEditSku } = useEditSku();

  useEffect(() => {
    setSkuEditReq({
      id: sku.id,
      productId: sku.productId,
      price: sku.price,
      desc: sku.desc,
      skuType: sku.skuType as SkuType,
      coinNum: sku.coinNum,
      coinBonus: sku.coinBonus,
      periodType: sku.periodType as SkuPeriodType,
      weight: sku.weight,
      important: sku.important as SkuImportant,
      paypalPlanId: sku.paypalPlanId,
      periodTotal: sku.periodTotal,
      paymentOptionId: sku.paymentOptionId,
      region: sku.region || '',
      currency: sku.currency || '',
      currencySign: sku.currencySign || '',
    });
  }, [isOpen]);

  const handleProductEditButton = async () => {
    try {
      setIsPending(true);
      await fetchEditSku(skuEditReq);
      setIsOpen(false);
      onSuccess?.();
      toast.add({ title: "编辑成功", variant: "success" });
    } catch (e) {
      toast.add({ title: "编辑失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Drawer.Backdrop isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="编辑商品" className="w-[600px]">
            <Drawer.CloseTrigger />
            <Drawer.Header className="p-2">
              <Drawer.Heading>编辑商品: [{sku.id}] {sku.bizId}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">产品域名</Label>
                <ProductSelect className="flex-1" value={skuEditReq.productId} onChange={(productId) => setSkuEditReq({ ...skuEditReq, productId })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">设置货币</Label>
                  <Input variant="secondary" className="flex-1" placeholder="输入货币" value={skuEditReq.currency} onChange={(e) => setSkuEditReq({ ...skuEditReq, currency: e.target.value })} />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <Label className="w-18 shrink-0 text-right">货币符号</Label>
                  <Input variant="secondary" className="flex-1" placeholder="输入货币符号" value={skuEditReq.currencySign} onChange={(e) => setSkuEditReq({ ...skuEditReq, currencySign: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">设置价格</Label>
                <Input variant="secondary" className="flex-1" value={skuEditReq.price} onChange={(e) => setSkuEditReq({ ...skuEditReq, price: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">展示区域</Label>
                <SkuRegionSelect className="flex-1" value={skuEditReq.region || ''} onChange={(region) => setSkuEditReq({ ...skuEditReq, region })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">支付选项</Label>
                <PaymentOptionSelect className="flex-1" value={skuEditReq.paymentOptionId || ""} onChange={(paymentOptionId: number) => setSkuEditReq({ ...skuEditReq, paymentOptionId })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">商品类型</Label>
                  <SkuTypeSelect className="flex-1" value={skuEditReq.skuType} onChange={(value) => setSkuEditReq({ ...skuEditReq, skuType: value as SkuType })} />
                </div>
                {
                  skuEditReq.skuType === SkuType.Subscription ? (
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <Label className="w-10 shrink-0 text-right">周期</Label>
                      <SkuPeriodSelect className="flex-1" value={skuEditReq.periodType as SkuPeriodType} onChange={(value) => setSkuEditReq({ ...skuEditReq, periodType: value as SkuPeriodType })} />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-4 flex-1">
                      <Label className="w-10 shrink-0 text-right">个数</Label>
                      <Input className="flex-1" variant="secondary" placeholder="输入个数" value={skuEditReq.coinNum} onChange={(e) => setSkuEditReq({ ...skuEditReq, coinNum: Number(e.target.value) })} />
                    </div>
                  )
                }
              </div>
              {
                skuEditReq.skuType === SkuType.Subscription ? (
                  <div className="flex flex-row items-center gap-4">
                    <Label className="w-18  shrink-0 text-right">周期总数</Label>
                    <Input variant="secondary" className="flex-1" value={skuEditReq.periodTotal} type="number" onChange={(e) => setSkuEditReq({ ...skuEditReq, periodTotal: Number(e.target.value) })} />
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-4">
                    <Label className="w-18 shrink-0 text-right">赠送金币</Label>
                    <Input variant="secondary" className="flex-1" placeholder="输入赠送金币" value={skuEditReq.coinBonus} onChange={(e) => setSkuEditReq({ ...skuEditReq, coinBonus: Number(e.target.value) })} />
                  </div>
                )
              }
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">商品权重</Label>
                <Input variant="secondary" className="flex-1" value={skuEditReq.weight} onChange={(e) => setSkuEditReq({ ...skuEditReq, weight: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">重点展示</Label>
                <SkuImportantSelect className="flex-1" value={skuEditReq.important} onChange={(value) => setSkuEditReq({ ...skuEditReq, important: value as SkuImportant })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18  shrink-0 text-right">横幅描述</Label>
                <Input variant="secondary" className="flex-1" value={skuEditReq.desc} onChange={(e) => setSkuEditReq({ ...skuEditReq, desc: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">PayPal计划</Label>
                <Input variant="secondary" className="flex-1" value={skuEditReq.paypalPlanId} onChange={(e) => setSkuEditReq({ ...skuEditReq, paypalPlanId: e.target.value })} />
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">取消</Button>
              <Button type="submit" isPending={isPending} onClick={handleProductEditButton}>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                确认修改
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
