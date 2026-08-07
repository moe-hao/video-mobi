import { useRetrieveOptionTable } from "@app/manage-web/hooks/retrieve-option";
import { Autocomplete, Description, EmptyState, Label, ListBox, SearchField, useFilter } from "@heroui/react";
import { useEffect, useState } from "react";

export default function RetrieveOptionSelect({ className, value, onChange }: { className?: string, value: number | "", onChange: (retrieveOptionId: number) => void }) {
  const { retrieveOptionTableState, fetchRetrieveOptionTable } = useRetrieveOptionTable();
  const [searchValue, setSearchValue] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  useEffect(() => {
    fetchRetrieveOptionTable({ page: 1, size: 100, search: '' });
  }, []);

  return (
    <Autocomplete
      aria-label="选择挽留配置"
      className={className}
      variant="secondary"
      placeholder="选择挽留配置"
      selectionMode="single"
      defaultValue={value}
      onChange={(key) => onChange(Number(key) || 0)}
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
          <SearchField aria-label="搜索挽留配置" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索挽留配置" />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到挽留配置</EmptyState>}>
            {retrieveOptionTableState.list?.map((item) => (
              <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                <Label>[{item.id}] {item.name}</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
