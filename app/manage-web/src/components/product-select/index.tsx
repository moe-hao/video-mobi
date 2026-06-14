import { useProductList } from "@app/manage-web/hooks/product";
import { Autocomplete, Label, Description, SearchField, ListBox, EmptyState } from "@heroui/react";
import { useEffect } from "react";

export default function ProductSelect({ className, value, onChange }: { className?: string, value: number | "", onChange: (productId: number) => void }) {
  const { productList, fetchProductList } = useProductList();

  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <Autocomplete
      aria-label="选择产品"
      className={className}
      variant="secondary"
      placeholder="选择产品"
      selectionMode="single"
      defaultValue={value}
      onChange={(productId) => onChange(Number(productId) || 0)}
    >
      <Label />
      <Autocomplete.Trigger >
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Description />
      <Autocomplete.Popover>
        <Autocomplete.Filter>
          <SearchField aria-label="搜索地区" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              < SearchField.Input placeholder="搜索地区" />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到地区</EmptyState>}>
            {productList.map((item) => (
              <ListBox.Item key={item.id} id={item.id} textValue={item.host}>
                <Label>{item.host}</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
