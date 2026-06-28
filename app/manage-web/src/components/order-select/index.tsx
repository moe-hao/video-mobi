import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { OrderStatusName, OrderStatus, OrderStatusList } from "@lib/common/consts/order";
import OrderStatusPoint from "@app/manage-web/pages/payment/order/order-status";

export default function OrderStatusSelect({ className, value, onChange }: { className?: string, value: OrderStatus | "", onChange: (status: OrderStatus | '') => void }) {
  return (
    <Autocomplete
      aria-label="选择订单状态"
      className={className}
      variant="secondary"
      placeholder="选择订单状态"
      selectionMode="single"
      defaultValue={value}
      onChange={(status) => onChange((status ?? '') as OrderStatus | '')}
    >
      <Label />
      < Autocomplete.Trigger >
        <Autocomplete.Value />
        < Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      < Description />
      <Autocomplete.Popover>
        <ListBox renderEmptyState={() => <EmptyState>没有找到订单状态</EmptyState>}>
          {OrderStatusList.map((item) => (
            <ListBox.Item key={item} id={item} textValue={OrderStatusName[item]}>
              <Label><OrderStatusPoint orderStatus={item} orderStatusName={OrderStatusName[item]} /></Label>
              < ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
