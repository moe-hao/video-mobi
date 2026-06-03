import { Autocomplete, Label, Description, SearchField, ListBox, EmptyState } from "@heroui/react";
import { Region, RegionName } from "@lib/common/consts/region";

export default function RegionSelect({ className, value, onChange }: { className?: string, value: Region | "", onChange: (region: Region) => void }) {
  return (
    <Autocomplete
      aria-label="选择地区"
      className={className}
      variant="secondary"
      placeholder="选择地区"
      selectionMode="single"
      value={value}
      onChange={(region) => onChange(region as Region)}
    >
      <Label />
      < Autocomplete.Trigger >
        <Autocomplete.Value />
        < Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      < Description />
      <Autocomplete.Popover>
        <Autocomplete.Filter>
          <SearchField autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              < SearchField.Input placeholder="搜索地区" />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到地区</EmptyState>}>
            {Object.values(Region).map((region) => (
              <ListBox.Item key={region} id={region} textValue={RegionName[region]}>
                <Label>{RegionName[region]}</Label>
                < ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
