import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { SkuType, SkuTypeName } from "@lib/common/consts/sku";

export default function OrderTypeSelect({ className, value, onChange }: { className?: string, value: SkuType | "", onChange: (status: SkuType | '') => void }) {
  return (
    <Autocomplete
      aria-label="选择订单类型"
      className={className}
      variant="secondary"
      placeholder="选择订单类型"
      selectionMode="single"
      defaultValue={value}
      onChange={(val) => onChange((val ?? '') as SkuType | '')}
    >
      <Label />
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Description />
      <Autocomplete.Popover>
        <ListBox renderEmptyState={() => <EmptyState>没有找到订单类型</EmptyState>}>
          {Object.entries(SkuTypeName).map(([key, name]) => (
            <ListBox.Item key={key} id={key} textValue={name}>
              <Label>{name}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
