import { Select, ListBox } from "@heroui/react";
import { CollectionType, CollectionTypeList, CollectionTypeName } from "@lib/common/consts/collection";

export default function CollectionTypeSelect({ className, collectionType, onChange }: { className?: string; collectionType: CollectionType; onChange: (value: CollectionType) => void }) {
  return (
    <Select
      aria-label="选择类型"
      variant="secondary"
      className={className}
      placeholder="选择类型"
      value={collectionType || ""}
      onChange={(value) => onChange(value as CollectionType)}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            CollectionTypeList.map((item) => (
              <ListBox.Item key={item} id={item} textValue={CollectionTypeName[item]}>{CollectionTypeName[item]}</ListBox.Item>
            ))
          }
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
