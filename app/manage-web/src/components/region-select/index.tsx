import { Autocomplete, Label, Description, SearchField, ListBox, EmptyState, useFilter } from "@heroui/react";
import { useState } from "react";
import { Region, RegionName } from "@lib/common/consts/region";

export default function RegionSelect({ className, value, onChange }: { className?: string, value: Region | "", onChange: (region: Region) => void }) {
  const [searchValue, setSearchValue] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <Autocomplete
      aria-label="选择地区"
      className={className}
      variant="secondary"
      placeholder="选择地区"
      selectionMode="single"
      defaultValue={value}
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
        <Autocomplete.Filter
          filter={contains}
          inputValue={searchValue}
          onInputChange={setSearchValue}
        >
          <SearchField aria-label="搜索地区" autoFocus variant="secondary">
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
