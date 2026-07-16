import { usePaymentOptionList } from "@app/manage-web/hooks/product";
import { Autocomplete, Description, EmptyState, Label, ListBox, SearchField, useFilter } from "@heroui/react";
import { useEffect, useState } from "react";

export default function PaymentOptionSelect({ className, value, onChange }: { className?: string, value: number | "", onChange: (paymentOptionId: number) => void }) {
  const { paymentOptionListState, fetchPaymentOptionList } = usePaymentOptionList();
  const [searchValue, setSearchValue] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  useEffect(() => {
    fetchPaymentOptionList({ page: 1, size: 100, search: '' });
  }, []);

  return (
    <Autocomplete
      aria-label="选择支付选项"
      className={className}
      variant="secondary"
      placeholder="选择支付选项"
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
          <SearchField aria-label="搜索支付选项" autoFocus variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索支付选项" />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>没有找到支付选项</EmptyState>}>
            {(paymentOptionListState?.list || []).map((item) => (
              <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                <Label>{item.name}</Label>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
