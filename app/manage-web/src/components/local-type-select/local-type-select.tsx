import { Select, ListBox } from "@heroui/react";
import { CollectionLocal, CollectionLocalList, CollectionLocalName } from "@lib/common/consts/collection";

export default function LocalTypeSelect({ className, local, onChange }: { className?: string; local: CollectionLocal; onChange: (value: CollectionLocal) => void }) {
  return (
    <Select
      aria-label="选择类型"
      variant="secondary"
      className={className}
      placeholder="选择类型"
      defaultValue={local}
      onChange={(value) => onChange(value as CollectionLocal)}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            CollectionLocalList.map((item) => (
              <ListBox.Item key={item} id={item} textValue={CollectionLocalName[item]}>{CollectionLocalName[item]}</ListBox.Item>
            ))
          }
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
