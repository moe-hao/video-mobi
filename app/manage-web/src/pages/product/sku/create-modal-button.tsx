import { Button, Drawer, Input, Label, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import ProductSelect from "@app/manage-web/components/product-select";
import type { SkuAddReq } from "@lib/common/dto/sku";
import { SkuImportant, SkuPeriodType, SkuType } from "@lib/common/consts/sku";
import { useAddSku } from "@app/manage-web/hooks/sku";
import { useToast } from "@app/manage-web/contexts/toast-context";
import { SkuImportantSelect } from "./sku-important-select";
import { SkuTypeSelect } from "./sku-type-select";
import { SkuPeriodSelect } from "./sku-period-select";
import PaymentOptionSelect from "@app/manage-web/components/payment-option-select";
import { SkuRegionSelect } from "./sku-region-select";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [skuAddReq, setSkuAddReq] = useState<SkuAddReq>({
    coinNum: 0,
    coinBonus: 0,
    periodType: "",
    periodTotal: 0,
    weight: 0,
    desc: "",
    paypalPlanId: "",
  } as SkuAddReq);
  const toast = useToast();
  const { fetchAddSku } = useAddSku();

  useEffect(() => {
    setSkuAddReq({} as SkuAddReq);
  }, [isOpen]);

  const handleProductEditButton = async () => {
    try {
      setIsPending(true);
      await fetchAddSku(skuAddReq);
      setIsOpen(false);
      onSuccess?.();
      toast.add({ title: "创建成功", variant: "success" });
    } catch (e) {
      toast.add({ title: "创建失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    } finally {
      setIsPending(false);
    }
  }


  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>新建商品</Button>
      <Drawer.Backdrop isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="新建商品" className="w-[600px]">
            <Drawer.CloseTrigger />
            <Drawer.Header className="p-2">
              <Drawer.Heading>新建商品</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">产品域名</Label>
                <ProductSelect className="flex-1" value={skuAddReq.productId} onChange={(productId) => setSkuAddReq({ ...skuAddReq, productId })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">设置货币</Label>
                  <Input variant="secondary" className="flex-1" placeholder="输入货币" value={skuAddReq.currency} onChange={(e) => setSkuAddReq({ ...skuAddReq, currency: e.target.value })} />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <Label className="w-18 shrink-0 text-right">货币符号</Label>
                  <Input variant="secondary" className="flex-1" placeholder="输入货币符号" value={skuAddReq.currencySign} onChange={(e) => setSkuAddReq({ ...skuAddReq, currencySign: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">设置价格</Label>
                <Input variant="secondary" className="flex-1" placeholder="输入价格" onChange={(e) => setSkuAddReq({ ...skuAddReq, price: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">展示区域</Label>
                <SkuRegionSelect className="flex-1" value={skuAddReq.region || ''} onChange={(region) => setSkuAddReq({ ...skuAddReq, region })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">支付选项</Label>
                <PaymentOptionSelect className="flex-1" value={skuAddReq.paymentOptionId} onChange={(paymentOptionId: number) => setSkuAddReq({ ...skuAddReq, paymentOptionId })} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-4 flex-1">
                  <Label className="w-18  shrink-0 text-right">商品类型</Label>
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
                  <>
                    <div className="flex flex-row items-center gap-4">
                      <Label className="w-18  shrink-0 text-right">周期总数</Label>
                      <Input variant="secondary" className="flex-1" placeholder="输入周期总数" value={skuAddReq.periodTotal} type="number" onChange={(e) => setSkuAddReq({ ...skuAddReq, periodTotal: Number(e.target.value) })} />
                    </div>
                    <div className="flex flex-row items-center gap-4">
                      <Label className="w-18 shrink-0 text-right">首订价格</Label>
                      <Input variant="secondary" className="flex-1" placeholder="输入首订价格" value={skuAddReq.firstPeriodPrice} onChange={(e) => setSkuAddReq({ ...skuAddReq, firstPeriodPrice: e.target.value })} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-row items-center gap-4">
                    <Label className="w-18 shrink-0 text-right">赠送金币</Label>
                    <Input variant="secondary" className="flex-1" placeholder="输入赠送金币" value={skuAddReq.coinBonus} onChange={(e) => setSkuAddReq({ ...skuAddReq, coinBonus: Number(e.target.value) })} />
                  </div>
                )
              }
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">商品权重</Label>
                <Input variant="secondary" className="flex-1" placeholder="输入商品权重" value={skuAddReq.weight} onChange={(e) => setSkuAddReq({ ...skuAddReq, weight: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">重点展示</Label>
                <SkuImportantSelect className="flex-1" value={skuAddReq.important} onChange={(value) => setSkuAddReq({ ...skuAddReq, important: value as SkuImportant })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18  shrink-0 text-right">横幅描述</Label>
                <Input variant="secondary" className="flex-1" placeholder="输入横幅描述" onChange={(e) => setSkuAddReq({ ...skuAddReq, desc: e.target.value })} />
              </div>
              {skuAddReq.skuType === SkuType.Subscription && (
                <div className="flex flex-row items-center gap-4">
                  <Label className="w-18 shrink-0 text-right">PayPal计划</Label>
                  <Input variant="secondary" className="flex-1" placeholder="在 PayPal 中创建计划" onChange={(e) => setSkuAddReq({ ...skuAddReq, paypalPlanId: e.target.value })} />
                </div>
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">取消</Button>
              <Button type="submit" isPending={isPending} onClick={handleProductEditButton}>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                新建商品
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer >
  );
}
