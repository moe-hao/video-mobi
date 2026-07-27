import { Autocomplete, Description, EmptyState, Label, ListBox, SearchField, useFilter } from "@heroui/react";
import { useState } from "react";

export const PlatformName: Record<number, string> = {
  1: 'Facebook',
  2: 'TikTok',
};

export default function PlatformSelect({ className, value, onChange }: { className?: string, value: string, onChange: (platform: string) => void }) {
  const [searchValue, setSearchValue] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <Autocomplete
      aria-label="选择平台"
      className={className}
      variant="secondary"
      placeholder="选择平台"
      selectionMode="single"
      defaultValue={value}
      onChange={(platform) => onChange(platform?.toString() || '')}
    >
      <Label />
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Description />
      <Autocomplete.Popover>
        <Autocomplete.Filter
          filter={contains}
          inputValue={searchValue}
          onInputChange={setSearchValue}
        >
          <SearchField aria-label="搜索平台" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索平台" />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到平台</EmptyState>}>
            {Object.entries(PlatformName).map(([key, name]) => (
              <ListBox.Item key={key} id={key} textValue={name}>
                <Label>{name}</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
