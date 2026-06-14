import { ListBox, Select } from "@heroui/react";
import { SkuType } from "@lib/common/consts/sku";

export function SkuTypeSelect({ className, value, onChange }: { className?: string, value: SkuType, onChange: (value: SkuType) => void }) {
  return (
    <Select aria-label="选择商品类型" placeholder="商品类型" variant="secondary" defaultValue={value} onChange={(value) => onChange(value as SkuType)} className={className}>
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
  )
}
