import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { CollectionType, CollectionTypeList, CollectionTypeName } from "@lib/common/consts/collection";

export default function CollectionTypeSelect({ className, collectionType, onChange }: { className?: string; collectionType: CollectionType | ''; onChange: (value: CollectionType) => void }) {
  return (
    <Autocomplete
      aria-label="选择类型"
      className={className}
      variant="secondary"
      placeholder="选择类型"
      selectionMode="single"
      defaultValue={collectionType}
      onChange={(value) => onChange((value ?? '') as CollectionType)}
    >
      <Label />
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Description />
      <Autocomplete.Popover>
        <ListBox renderEmptyState={() => <EmptyState>没有找到类型</EmptyState>}>
          {CollectionTypeList.map((item) => (
            <ListBox.Item key={item} id={item} textValue={CollectionTypeName[item]}>
              <Label>{CollectionTypeName[item]}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
