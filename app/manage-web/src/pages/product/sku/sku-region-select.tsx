import { Autocomplete, Label, Description, SearchField, ListBox, EmptyState, useFilter } from "@heroui/react";
import { useState } from "react";
import { Region, RegionName } from "@lib/common/consts/region";

export function SkuRegionSelect({ className, value, onChange }: { className?: string, value: string, onChange: (region: string) => void }) {
  const [searchValue, setSearchValue] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <Autocomplete
      aria-label="选择地区"
      className={className}
      variant="secondary"
      placeholder="选择地区"
      key={value}
      selectionMode="single"
      defaultValue={value}
      onChange={(region) => onChange(String(region || ''))}
    >
      <Label />
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Description />
      <Autocomplete.Popover>
        <Autocomplete.Filter
          filter={contains}
          inputValue={searchValue}
          onInputChange={setSearchValue}
        >
          <SearchField aria-label="搜索地区" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索地区" />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到地区</EmptyState>}>
            <ListBox.Item key="" id="" textValue="产品范围全部">
              <Label>产品范围全部</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
            {Object.values(Region).map((region) => (
              <ListBox.Item key={region} id={region} textValue={RegionName[region]}>
                <Label>{RegionName[region]}</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
