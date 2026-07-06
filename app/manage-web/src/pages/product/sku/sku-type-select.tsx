import { ListBox, Select } from "@heroui/react";
import { SkuType, SkuTypeName } from "@lib/common/consts/sku";

export function SkuTypeSelect({ className, value, onChange }: { className?: string, value: SkuType, onChange: (value: SkuType) => void }) {
  return (
    <Select aria-label="选择商品类型" placeholder="商品类型" variant="secondary" defaultValue={value} onChange={(value) => onChange(value as SkuType)} className={className}>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            Object.entries(SkuTypeName).map(([key, value]) => {
              return <ListBox.Item key={key} id={key} textValue={key}>{value}</ListBox.Item>;
            })
          }
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
