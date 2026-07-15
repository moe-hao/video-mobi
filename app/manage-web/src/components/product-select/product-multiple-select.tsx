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
import { useEffect, useState } from "react";
import { useProductList } from "@app/manage-web/hooks/product";

export default function ProductMultipleSelect({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: number[];
  onChange: (productIds: number[]) => void;
}) {
  const { productList, fetchProductList } = useProductList();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>(value.map(String));
  const { contains } = useFilter({ sensitivity: "base" });

  useEffect(() => {
    fetchProductList();
  }, []);

  const onRemoveTags = (keys: Set<Key>) => {
    const nextKeys = selectedKeys.filter((key) => !keys.has(key));
    setSelectedKeys(nextKeys);
    onChange(nextKeys.map(Number));
  };

  return (
    <Autocomplete
      aria-label="选择产品"
      className={className}
      variant="secondary"
      placeholder="选择产品"
      selectionMode="multiple"
      value={selectedKeys}
      onChange={(keys) => {
        const nextKeys = keys as Key[];
        setSelectedKeys(nextKeys);
        onChange(nextKeys.map(Number));
      }}
    >
      <Autocomplete.Trigger>
        <Autocomplete.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }
            const count = state.selectedItems.length;
            if (count === 1) {
              const product = productList.find((p) => String(p.id) === String(state.selectedItems[0].key));
              return (
                <TagGroup size="sm" onRemove={onRemoveTags} aria-label="已选择产品">
                  <TagGroup.List className="flex flex-nowrap gap-1">
                    <Tag id={state.selectedItems[0].key} className="bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-medium shrink-0">
                      {product?.host || state.selectedItems[0].key}
                    </Tag>
                  </TagGroup.List>
                </TagGroup>
              );
            }
            const firstProduct = productList.find((p) => String(p.id) === String(state.selectedItems[0].key));
            return (
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-medium px-2 py-0.5 shrink-0 truncate max-w-32">
                  {firstProduct?.host || state.selectedItems[0].key}
                </span>
                <span className="text-xs text-gray-500 shrink-0">+{count - 1}</span>
              </span>
            );
          }}
        </Autocomplete.Value>
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField aria-label="搜索产品" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索产品" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到产品</EmptyState>}>
            {productList.map((item) => (
              <ListBox.Item key={String(item.id)} id={String(item.id)} textValue={item.host}>
                {item.host}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
}
