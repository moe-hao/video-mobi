import { ListBox, Select } from "@heroui/react";
import { SkuImportant } from "@lib/common/consts/sku";

export function SkuImportantSelect({ className, value, onChange }: { className?: string, value: SkuImportant, onChange: (value: SkuImportant) => void }) {
  return (
    <Select aria-label="选择商品重要性" placeholder="是否重点展示" variant="secondary" defaultValue={value} onChange={(value) => onChange(value as SkuImportant)} className={className}>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item key={SkuImportant.Yes} id={SkuImportant.Yes} textValue="是">是</ListBox.Item>
          <ListBox.Item key={SkuImportant.No} id={SkuImportant.No} textValue="否">否</ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
