import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { PublishStatus, PublishStatusList, PublishStatusName } from "@lib/common/consts/collection";

export default function PublishStatusSelect({ className, publishStatus, onChange }: { className?: string; publishStatus: PublishStatus | ''; onChange: (value: PublishStatus) => void }) {
  return (
    <Autocomplete
      aria-label="选择上下架状态"
      className={className}
      variant="secondary"
      placeholder="选择上下架状态"
      selectionMode="single"
      defaultValue={publishStatus}
      onChange={(value) => onChange((value ?? '') as PublishStatus)}
    >
      <Label />
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Description />
      <Autocomplete.Popover>
        <ListBox renderEmptyState={() => <EmptyState>没有找到状态</EmptyState>}>
          {PublishStatusList.map((item) => (
            <ListBox.Item key={item} id={item} textValue={PublishStatusName[item]}>
              <Label>{PublishStatusName[item]}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
