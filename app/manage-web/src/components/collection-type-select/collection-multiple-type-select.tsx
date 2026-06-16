import type { Key } from "@heroui/react";
import {
  Autocomplete,
  EmptyState,
  ListBox,
  SearchField,
  Tag,
  TagGroup,
  useFilter,
} from "@heroui/react";
import { useState } from "react";
import { CollectionType, CollectionTypeList, CollectionTypeName } from "@lib/common/consts/collection";

export default function CollectionMultipleTypeSelect({
  className,
  collectionTypeList,
  onChange,
}: {
  className?: string;
  collectionTypeList: CollectionType[];
  onChange: (value: CollectionType[]) => void;
}) {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>((collectionTypeList ?? []).map(String));
  const { contains } = useFilter({ sensitivity: "base" });

  const onRemoveTags = (keys: Set<Key>) => {
    setSelectedKeys((prev) => prev.filter((key) => !keys.has(key)));
  };

  return (
    <Autocomplete
      aria-label="选择类型"
      className={className}
      variant="secondary"
      placeholder="选择类型"
      selectionMode="multiple"
      value={selectedKeys}
      onChange={(keys) => {
        const nextKeys = keys as Key[];
        setSelectedKeys(nextKeys);
        onChange(nextKeys.map(Number) as CollectionType[]);
      }}
    >
      <Autocomplete.Trigger>
        <Autocomplete.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }
            const selectedItemsKeys = state.selectedItems.map((item) => item.key);
            return (
              <TagGroup size="sm" onRemove={onRemoveTags} aria-label="已选择类型">
                <TagGroup.List>
                  {selectedItemsKeys.map((selectedItemKey) => {
                    const typeKey = Number(selectedItemKey) as CollectionType;
                    return (
                      <Tag key={selectedItemKey} id={selectedItemKey} className="bg-white">
                        {CollectionTypeName[typeKey]}
                      </Tag>
                    );
                  })}
                </TagGroup.List>
              </TagGroup>
            );
          }}
        </Autocomplete.Value>
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField aria-label="搜索类型" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索类型" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到类型</EmptyState>}>
            {CollectionTypeList.map((item) => (
              <ListBox.Item key={String(item)} id={String(item)} textValue={CollectionTypeName[item]}>
                {CollectionTypeName[item]}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
}
