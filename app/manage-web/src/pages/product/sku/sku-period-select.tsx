import { ListBox, Select } from "@heroui/react";
import { SkuPeriodType, SkuPeriodTypeName } from "@lib/common/consts/sku";

export function SkuPeriodSelect({ className, value, onChange }: { className?: string, value: SkuPeriodType, onChange: (value: SkuPeriodType) => void }) {
  return (
    <Select aria-label="选择商品周期" placeholder="商品周期" variant="secondary" defaultValue={value} onChange={(value) => onChange(value as SkuPeriodType)} className={className}>
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
  )
}
