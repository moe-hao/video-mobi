import { Select, ListBox } from "@heroui/react";
import { RelationTypeName, RelationTypeList } from "@lib/common/consts/relation";
import type { RelationType as RelationTypeValue } from "@lib/common/consts/relation";

export default function RelationSelect({ className, value, onChange }: { className?: string; value: RelationTypeValue | ""; onChange: (value: RelationTypeValue | "") => void }) {
  return (
    <Select
      aria-label="选择关联关系"
      variant="secondary"
      className={className}
      placeholder="选择关联关系"
      defaultValue={value}
      onChange={(value) => onChange((value || '') as RelationTypeValue)}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            RelationTypeList.map((item) => (
              <ListBox.Item key={item} id={item} textValue={RelationTypeName[item]}>{RelationTypeName[item]}</ListBox.Item>
            ))
          }
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
